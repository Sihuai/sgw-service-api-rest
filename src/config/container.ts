import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { bindings } from './inversity.config';

export const createContainer = async () => {
  const container = new Container();

  // User
  await require('../app/service/impl/token.service.impl');
  await require('../app/service/impl/user.service.impl');
  // Home
  await require('../app/service/impl/bill.board.service.impl');
  await require('../app/service/impl/home.service.impl');
  await require('../app/service/impl/section.service.impl');

  await container.loadAsync(bindings);

  container.load(buildProviderModule());
  return container;
};
