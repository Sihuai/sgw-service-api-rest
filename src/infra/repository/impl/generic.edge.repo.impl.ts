import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { GenericEdge } from "../../../domain/models/generic.edge";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { GenericEdgeRepo } from "../generic.edge.repo";

@provide(IOC_TYPE.GenericEdgeRepoImpl)
export class GenericEdgeRepoImpl implements GenericEdgeRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [GenericEdge]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<GenericEdge>("GenericEdge");
      const result = await repo.edgeFindAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async page(filters, pageIndex: number, pageSize: number) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [GenericEdge]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        limit: {
          pageIndex: pageIndex,
          pageSize: pageSize
        },
        return: 'doc'
      };
      
      const repo = con.repositoryFor<GenericEdge>("GenericEdge");
      const result = await repo.paginationBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [GenericEdge]});

    try {
      const repo = con.repositoryFor<GenericEdge>("GenericEdge");
      const result = await repo.edgeFindOneBy(filters, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [GenericEdge]});

    try {
      const repo = con.repositoryFor<GenericEdge>("GenericEdge");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [GenericEdge]});

    try {
      const repo = con.repositoryFor<GenericEdge>("GenericEdge");
      const result = await repo.edgeUpdate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}
}