import { AsyncContainerModule, interfaces } from 'inversify';

import { IOC_TYPE } from './type';

// import { Author } from '../domain/entity/author';
// import { AuthorRepository } from '../infra/repository/author.repo';
// import { createORMConnection, IORMConnection } from '../infra/utils/create-orm-connection';

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

    // const ormConnection = await createORMConnection();
    // bind<IORMConnection>(IOC_TYPE.ORMConnection).toConstantValue(ormConnection);
  });