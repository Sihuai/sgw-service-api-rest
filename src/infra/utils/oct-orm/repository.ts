import { DeepPartial } from "./types/deep.partial";
import { Metadata } from "./metadata/MetadataManager";
import { ENTITY_NAME } from "./keys/entity.keys";
import { Connection } from "./connection";
import { normalizeDataForCreate, normalizeDataForRead, normalizeDataForUpdate, normalizeEdgeForCreate, normalizeSimpleDataForRead } from "./lib/util";
import { ArrayOr } from "./types/array.or.type";
import { DocumentData, DocumentMetadata, Edge, EdgeData } from "arangojs/documents";
import { CollectionInsertOptions, DocumentCollection, EdgeCollection } from "arangojs/collection";
import { isValidJSON } from "../data.validator";
import { Pagination, Records } from "./models/pagination";
import { AQLClauses } from "./types/aqlClauses";
import { PageResult } from "./types/pageResult";

export type EntityDocument<T extends object> = DeepPartial<DocumentData<T>>;

export class Repository<T extends object> {
  protected collection: DocumentCollection;
  protected entity: Function;

  constructor(protected connection: Connection, entity: string | Function) {
    if (typeof entity === "function") {
      entity = Metadata.get(entity, ENTITY_NAME);
    }

    const result = this.connection.getEntity(entity);
    this.entity = result != undefined ? result : Function;

    this.collection = connection.db.collection(entity as string);
  }

  async create(data: EntityDocument<T>, isFullDataReturn: boolean): Promise<EntityDocument<T>>;
  async create(data: EntityDocument<T>[], isFullDataReturn: boolean): Promise<EntityDocument<T>[]>;
  async create(data: ArrayOr<EntityDocument<T>>, isFullDataReturn: boolean): Promise<ArrayOr<EntityDocument<T>>> {
    const dataToWrite = normalizeDataForCreate(this.entity, data);
    const result = await this.collection.save(dataToWrite, { returnNew: true });
    if (isFullDataReturn === true) return normalizeDataForRead<EntityDocument<T>>(this.entity, result.new);
    return normalizeSimpleDataForRead<EntityDocument<T>>(this.entity, result.new);
  }

  async update(data: EntityDocument<T>) : Promise<any> {
    const dataToWrite = normalizeDataForUpdate(this.entity, data);
    return this.collection.update(dataToWrite, dataToWrite, {
      mergeObjects: true
    });
  }

  async deleteByKey(key: string) : Promise<any>;
  async deleteByKey(keys: string[]) : Promise<any>;
  async deleteByKey(keys: ArrayOr<string>) : Promise<any> {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.collection.removeByKeys(keys, { returnOld: true });
  }

  async findAll(isFullDataReturn: boolean) : Promise<any> {
    const aqlCode = `FOR doc IN ${this.collection.name} RETURN doc`;

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    if (isFullDataReturn === true) return normalizeDataForRead(this.entity, result);
    return normalizeSimpleDataForRead(this.entity, result);
  }

  async findAllBy(aql: AQLClauses, isFullDataReturn: boolean) : Promise<any> {
    const aqlClauses: Array<string> = [];
    // checks
    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER (${aql.filter})`);
    if(aql.sort) aqlClauses.push(`SORT ${aql.sort}`);
    if(aql.limit) aqlClauses.push(`LIMIT ${aql.limit.pageIndex}, ${aql.limit.pageSize}`);
    if(aql.return.trim().startsWith('{') && aql.return.trim().endsWith('}') ){
        if(isValidJSON(aql.return.trim())) aqlClauses.push(`RETURN aql.return`);
    }

    // not a JSON string
    if( aql.return.trim().length === 0) aqlClauses.push(`RETURN ${aql.for.trim()}`);
    // return clause (non-JSON) is set
    aqlClauses.push(`RETURN ${aql.return.trim()}`);
    
    const aqlCode = aqlClauses.join("\n");

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    if (isFullDataReturn === true) return normalizeDataForRead(this.entity, result);
    return normalizeSimpleDataForRead(this.entity, result);
  }

  async findByKey(key: string, isFullDataReturn: boolean) : Promise<any>;
  async findByKey(keys: string[], isFullDataReturn: boolean) : Promise<any>;
  async findByKey(keys: ArrayOr<string>, isFullDataReturn: boolean) : Promise<any> {
    const isMulti = Array.isArray(keys);
    keys = (isMulti ? keys : [keys]) as string[];
    const result = await this.collection.lookupByKeys(keys)
    
    const data = isFullDataReturn === true ? normalizeDataForRead<string>(this.entity, result) : normalizeSimpleDataForRead<string>(this.entity, result);
    return isMulti ? data : data[0]
  }

  async findOneBy(doc: ArrayOr<EntityDocument<T>>, isFullDataReturn: boolean) : Promise<any> {
    try {
      const result = await this.collection.firstExample(doc);

      if (isFullDataReturn === true) return normalizeDataForRead(this.entity, result);
      return normalizeSimpleDataForRead(this.entity, result);
    } catch (e) {
      if (e.message == 'no match') return null;
      throw e;
    }
  }

  async countBy(aql: AQLClauses) : Promise<any> {
    const aqlClauses: Array<string> = [];

    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER ${aql.filter}`);
    
    aqlClauses.push(`COLLECT WITH COUNT INTO length`);
    aqlClauses.push(`RETURN length`);
    
    const aqlCode = aqlClauses.join('\n');

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    return result[0];
  }

  async paginationBy(aql: AQLClauses, isFullDataReturn: boolean): Promise<any> {
    const aqlClauses: Array<string> = [];
    // checks
    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER (${aql.filter})`);
    if(aql.sort) aqlClauses.push(`SORT ${aql.sort}`);
    if(aql.limit) aqlClauses.push(`LIMIT ${aql.limit.pageIndex}, ${aql.limit.pageSize}`);
    if(aql.return.trim().startsWith('{') && aql.return.trim().endsWith('}') ){
        if(isValidJSON(aql.return.trim())) aqlClauses.push(`RETURN aql.return`);
    }

    // not a JSON string
    if( aql.return.trim().length === 0) aqlClauses.push(`RETURN ${aql.for.trim()}`);
    // return clause (non-JSON) is set
    aqlClauses.push(`RETURN ${aql.return.trim()}`);
    
    const aqlCode = aqlClauses.join("\n");

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    const data = isFullDataReturn === true ? normalizeDataForRead(this.entity, result) :  normalizeSimpleDataForRead(this.entity, result);
    
    const pageSize = aql.limit?.pageSize ? aql.limit.pageSize : -1;
    const index = (aql.limit != undefined && aql.limit.pageIndex >= 0 && pageSize > 0) ? Math.ceil(aql.limit.pageIndex / pageSize) : -1;

    const totalRecord = await this.countBy(aql);
    const totalPage = (pageSize > 0 && index > 0) ? Math.ceil(totalRecord / pageSize) : -1

    const record = new Records();
    record.pageIndex = (aql.limit != undefined && aql.limit.pageIndex >= 0) ? aql.limit.pageIndex : -1;
    record.pageSize = pageSize;
    record.total = totalRecord;
    const paging = new Pagination();
    paging.index = index;
    paging.total = totalPage;
    paging.records = record;
    
    return {
        data: data,
        pagination : paging
    };
  }

  async paginationByKey(key: string, sort, limit, isFullDataReturn: boolean): Promise<PageResult>;
  async paginationByKey(keys: string[], sort, limit, isFullDataReturn: boolean): Promise<PageResult>;
  async paginationByKey(keys: ArrayOr<string>, sort, limit, isFullDataReturn: boolean): Promise<PageResult> {
    keys = Array.isArray(keys) ? keys : [keys];
    
    const aqlClauses: Array<string> = [];

    aqlClauses.push(`FOR key IN ${keys}`);
    aqlClauses.push(`LET doc = DOCUMENT(${this.collection.name}, key)`);
    
    if(sort) aqlClauses.push(`SORT ${sort}`);
    if(limit) aqlClauses.push(`LIMIT ${limit.pageIndex}, ${limit.pageSize}`);

    aqlClauses.push(`RETURN doc`);
    const aqlCode = aqlClauses.join("\n");

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    const data = isFullDataReturn === true ? normalizeDataForRead(this.entity, result) : normalizeSimpleDataForRead(this.entity, result);
    
    const pageSize = limit?.count ? limit.pageSize : -1;
    const index = (limit != undefined && limit.pageIndex >= 0 && pageSize > 0) ? (limit.pageIndex / pageSize) + 1 : -1;

    const aql = {
      for: 'doc',
      return: 'doc'
    };
    const totalRecord = await this.countBy(aql);
    const totalPage = (pageSize > 0 && index > 0) ? Math.ceil(totalRecord / pageSize) : -1

    const record = new Records();
    record.pageIndex = (limit != undefined && limit.pageIndex >= 0) ? limit.pageIndex : -1;
    record.pageSize = pageSize;
    record.total = totalRecord;
    const paging = new Pagination();
    paging.index = index;
    paging.total = totalPage;
    paging.records = record;
    
    return {
        data: data,
        pagination : paging
    };
  }

  async edgeFindAllBy(aql: AQLClauses, isFullDataReturn: boolean) : Promise<any> {
    const aqlClauses: Array<string> = [];
    // checks
    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER (${aql.filter})`);
    if(aql.sort) aqlClauses.push(`SORT ${aql.sort}`);
    if(aql.limit) aqlClauses.push(`LIMIT ${aql.limit.pageIndex}, ${aql.limit.pageSize}`);
    if(aql.return.trim().startsWith('{') && aql.return.trim().endsWith('}') ){
        if(isValidJSON(aql.return.trim())) aqlClauses.push(`RETURN aql.return`);
    }

    // not a JSON string
    if( aql.return.trim().length === 0) aqlClauses.push(`RETURN ${aql.for.trim()}`);
    // return clause (non-JSON) is set
    aqlClauses.push(`RETURN ${aql.return.trim()}`);
    
    const aqlCode = aqlClauses.join("\n");

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    if (isFullDataReturn === true) return normalizeDataForRead(this.entity, result);
    return normalizeSimpleDataForRead(this.entity, result);
  }

  async edgeFindOneBy(doc: Partial<DocumentData<T>>, isFullDataReturn: boolean) : Promise<any> {
    try {
      const edges = this.collection as EdgeCollection<T>;

      const result = await edges.firstExample(doc);

      if (isFullDataReturn === true) return normalizeDataForRead(this.entity, result);
      return normalizeSimpleDataForRead(this.entity, result);
    } catch (e) {
      if (e.message == 'no match') return null;
      throw e;
    }
  }

  async edgeCreate(data: EdgeData<T>, options?: CollectionInsertOptions): Promise<DocumentMetadata & { new?: Edge<T>; }>;
  async edgeCreate(data: EdgeData<T>[], options?: CollectionInsertOptions): Promise<DocumentMetadata & { new?: Edge<T>; }>;
  async edgeCreate(data: ArrayOr<EdgeData<T>>, options?: CollectionInsertOptions): Promise<DocumentMetadata & { new?: Edge<T>; }> {
    try {
      const edges = this.collection as EdgeCollection<T>;

      const dataToWrite = normalizeEdgeForCreate(this.entity, data);
      const result = edges.save(dataToWrite, options);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async edgeUpdate(data: DocumentData<T>): Promise<DocumentMetadata & { new?: Edge<T>; }> {
    try {
      const dataToWrite = normalizeDataForUpdate(this.entity, data);

      const edges = this.collection as EdgeCollection<T>;
      const result = edges.update(dataToWrite, dataToWrite, { returnNew: true });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async edgeDeleteByKey(key: string) : Promise<any>;
  async edgeDeleteByKey(keys: string[]) : Promise<any>;
  async edgeDeleteByKey(keys: ArrayOr<string>) : Promise<any> {
    keys = Array.isArray(keys) ? keys : [keys];
    const edges = this.collection as EdgeCollection<T>;
    const result = await edges.removeByKeys(keys, { returnOld: true });
    return result
  }
}