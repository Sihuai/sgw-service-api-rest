import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { AnimationPlayback } from "../../../domain/models/animation.playback";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { AnimationPlaybackRepo } from "../animation.playback.repo";

@provide(IOC_TYPE.AnimationPlaybackRepoImpl)
export class AnimationPlaybackRepoImpl implements AnimationPlaybackRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [AnimationPlayback]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<AnimationPlayback>("AnimationPlayback");
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
    const con = await createConnection({...ormSGWConnParam, entities: [AnimationPlayback]});

    try {
      const repo = con.repositoryFor<AnimationPlayback>("AnimationPlayback");
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
    const con = await createConnection({...ormSGWConnParam, entities: [AnimationPlayback]});

    try {
      const repo = con.repositoryFor<AnimationPlayback>("AnimationPlayback");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [AnimationPlayback]});

    try {
      const repo = con.repositoryFor<AnimationPlayback>("AnimationPlayback");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}