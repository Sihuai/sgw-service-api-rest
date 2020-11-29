import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { BillBoard } from "../../../domain/models/bill.board";
import { createConnection } from "../../utils/oct-orm";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { BillBoardRepo } from "../bill.board.repo";

@provide(IOC_TYPE.BillBoardRepoImpl)
export class BillBoardRepoImpl implements BillBoardRepo {
  async selectAll() : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.findAll();

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.findAllBy(filters);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.findOneBy(filters);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async existsBy(filters) : Promise<boolean> {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.findOneBy(filters);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.create(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [BillBoard]});

    try {
      const repo = con.repositoryFor<BillBoard>("BillBoard");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}