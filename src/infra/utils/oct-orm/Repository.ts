import { DeepPartial } from "./types/deepPartial";
import { Metadata } from "./metadata/MetadataManager";
import { ENTITY_NAME } from "./keys/entity.keys";
import { Connection } from "./connection";
import { normalizeDataForWrite, normalizeDataForRead } from "./lib/util";
import { ArrayOr } from "./types/arrayOrType";
import { DocumentData } from "arangojs/documents";
import { DocumentCollection } from "arangojs/collection";
import { isValidJSON } from "../data.validator";
import { Pagination, Records } from "./models/pagination";
import { AQLClauses } from "./types/aqlClauses";

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

  async create(data: EntityDocument<T>): Promise<EntityDocument<T>>;
  async create(data: EntityDocument<T>[]): Promise<EntityDocument<T>[]>;
  async create(
    data: ArrayOr<EntityDocument<T>>
  ): Promise<ArrayOr<EntityDocument<T>>> {
    const dataToWrite = normalizeDataForWrite(this.entity, data);
    const result = await this.collection.save(dataToWrite, { returnNew: true });
    return normalizeDataForRead<EntityDocument<T>>(this.entity, result.new);
  }

  async update(data: EntityDocument<T>) {
    const dataToWrite = normalizeDataForWrite(this.entity, data);
    return this.collection.update(dataToWrite, dataToWrite, {
      mergeObjects: true
    });
  }

  async deleteByKey(key: string);
  async deleteByKey(keys: string[]);
  async deleteByKey(keys: ArrayOr<string>) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.collection.removeByKeys(keys, { returnOld: true });
  }

  async findAll() {
    // const result = await this.collection.all();
    // return normalizeDataForRead(this.entity, result);
    const aqlCode = `FOR doc IN ${this.collection.name} RETURN doc`;

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    return normalizeDataForRead(this.entity, result);
  }

  async findAllBy(aql: AQLClauses) {
    // const result = await this.collection.byExample(doc);
    // return normalizeDataForRead(this.entity, result);
    const aqlClauses: Array<string> = [];
    // checks
    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER (${aql.filter})`);
    if(aql.sort) aqlClauses.push(`SORT ${aql.sort}`);
    if(aql.limit) aqlClauses.push(`LIMIT ${aql.limit.offset}, ${aql.limit.count}`);
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

    return normalizeDataForRead(this.entity, result);
  }

  async findByKey(key: string);
  async findByKey(keys: string[]);
  async findByKey(keys: ArrayOr<string>) {
    const isMulti = Array.isArray(keys);
    keys = (isMulti ? keys : [keys]) as string[];
    const result = await this.collection.lookupByKeys(keys)
    // const data = normalizeDataForRead(this.entity, result);
    const data = normalizeDataForRead<string>(this.entity, result);
    return isMulti ? data : data[0]
  }

  async findOneBy(doc: ArrayOr<EntityDocument<T>>) {
    try {
      const result = await this.collection.firstExample(doc);
      return normalizeDataForRead(this.entity, result);
    } catch (e) {
      if (e.message == 'no match') return null;
      throw e;
    }
  }

  async countBy(aql: AQLClauses, ignoreFilterClause: boolean) {
    const aqlClauses: Array<string> = [];

    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if( aql.filter && !ignoreFilterClause ) aqlClauses.push(`FILTER ${aql.filter}`);
    
    aqlClauses.push(`COLLECT WITH COUNT INTO length`);
    aqlClauses.push(`RETURN length`);
    
    const aqlCode = aqlClauses.join('\n');

    const cursor = await this.connection.db.query(aqlCode);
    const result = await cursor.all();

    return result[0];
  }

  async pagination(aql: AQLClauses) {
    const aqlClauses: Array<string> = [];
    // checks
    aqlClauses.push(`FOR ${aql.for} IN ${this.collection.name}`);

    if(aql.filter) aqlClauses.push(`FILTER (${aql.filter})`);
    if(aql.sort) aqlClauses.push(`SORT ${aql.sort}`);
    if(aql.limit) aqlClauses.push(`LIMIT ${aql.limit.offset}, ${aql.limit.count}`);
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

    const data = normalizeDataForRead(this.entity, result);
    
    const perPage = aql.limit?.count ? aql.limit.count : -1;
    const index = (aql.limit != undefined && aql.limit.offset >= 0 && perPage > 0) ? (aql.limit.offset / perPage) + 1 : -1;

    const totalRecord = await this.countBy(aql, false);
    const totalPage = (perPage > 0 && index > 0) ? Math.ceil(totalRecord / perPage) : -1

    const record = new Records();
    record.offset = (aql.limit != undefined && aql.limit.offset >= 0) ? aql.limit.offset : -1;
    record.perPage = perPage;
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
}