import { AsyncContainerModule, interfaces } from 'inversify';
// import { createORMConnection, IORMConnection } from '../infra/utils/orm.connection';

import { IOC_TYPE } from './type';

// import { Author } from '../domain/entity/author';
// import { AuthorRepository } from '../infra/repository/author.repo';

// import { AppConfigService } from '../app/service/app-config.service';

export const bindings = new AsyncContainerModule(
  async (bind: interfaces.Bind, unbind: interfaces.Unbind) => {

    await require('../presentation/http/controller/auth.controller');
    await require('../presentation/http/controller/home.controller');
    await require('../presentation/http/controller/user.controller');

    // bind<any>(IOC_TYPE.AppConfigService).toDynamicValue(() => {
    //   return new AppConfigService({

    //   });
    // }).inSingletonScope();

    // bind<Repository<Author>>(IOC_TYPE.AuthorRepository).toDynamicValue(() => {
    //   return getCustomRepository(AuthorRepository);
    // }).inRequestScope();

    // const DS_TG_CONFIG_NAME = process.env.DS_SECURITY_CONFIG_NAME|| '';
    // const DS_SGW_CONFIG_NAME = process.env.DS_APP_CONFIG_NAME|| '';
    // const ENV = process.env.NODE_ENV || 'development';

    // const tgORMConnection = await createORMConnection(ENV, DS_TG_CONFIG_NAME);
    // if (tgORMConnection != null) bind<IORMConnection>(IOC_TYPE.TGORMConnection).toConstantValue(tgORMConnection);

    // const sgwORMConnection = await createORMConnection(ENV, DS_SGW_CONFIG_NAME);
    // if (sgwORMConnection != null) bind<IORMConnection>(IOC_TYPE.SGWORMConnection).toConstantValue(sgwORMConnection);


  });