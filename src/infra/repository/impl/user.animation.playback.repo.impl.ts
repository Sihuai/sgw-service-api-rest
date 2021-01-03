import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { UserAnimationPlayback } from "../../../domain/models/user.animation.playback";
import { createConnection } from "../../utils/oct-orm";
import { ArrayOr } from "../../utils/oct-orm/types/array.or.type";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { UserAnimationPlaybackRepo } from "../user.animation.playback.repo";

@provide(IOC_TYPE.UserAnimationPlaybackRepoImpl)
export class UserAnimationPlaybackRepoImpl implements UserAnimationPlaybackRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.findAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllByKey(key: string);
  async selectAllByKey(keys: string[]);
  async selectAllByKey(keys: ArrayOr<string>) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const isMulti = Array.isArray(keys);
      keys = (isMulti ? keys : [keys]) as string[];

      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.findByKey(keys, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.findOneBy(filters, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.create(model, false);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAnimationPlayback]});

    try {
      const repo = con.repositoryFor<UserAnimationPlayback>("UserAnimationPlayback");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}