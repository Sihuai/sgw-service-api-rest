import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { OrderPaymentTransaction } from "../../../domain/models/order.payment.transaction";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { OrderPaymentTransactionRepo } from "../order.payment.transaction.repo";

@provide(IOC_TYPE.OrderPaymentTransactionRepoImpl)
export class OrderPaymentTransactionRepoImpl implements OrderPaymentTransactionRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [OrderPaymentTransaction]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<OrderPaymentTransaction>("OrderPaymentTransaction");
      const result = await repo.edgeFindAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [OrderPaymentTransaction]});

    try {
      const repo = con.repositoryFor<OrderPaymentTransaction>("OrderPaymentTransaction");
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
    const con = await createConnection({...ormSGWConnParam, entities: [OrderPaymentTransaction]});

    try {
      const repo = con.repositoryFor<OrderPaymentTransaction>("OrderPaymentTransaction");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [OrderPaymentTransaction]});

    try {
      const repo = con.repositoryFor<OrderPaymentTransaction>("OrderPaymentTransaction");
      const result = await repo.edgeUpdate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
  
  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [OrderPaymentTransaction]});

    try {
      const repo = con.repositoryFor<OrderPaymentTransaction>("OrderPaymentTransaction");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}