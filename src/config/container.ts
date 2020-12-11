import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { bindings } from './inversity.config';

export const createContainer = async () => {
  const container = new Container();

  // 1. Repository
  await require('../infra/repository/impl/bill.board.repo.impl');
  await require('../infra/repository/impl/category.repo.impl');
  await require('../infra/repository/impl/cart.repo.impl');
  await require('../infra/repository/impl/cart.product.repo.impl');
  await require('../infra/repository/impl/media.repo.impl');
  await require('../infra/repository/impl/option.type.repo.impl');
  await require('../infra/repository/impl/section.repo.impl');
  await require('../infra/repository/impl/section.trail.repo.impl');
  await require('../infra/repository/impl/token.repo.impl');
  await require('../infra/repository/impl/trail.repo.impl');
  await require('../infra/repository/impl/trail.detail.repo.impl');
  await require('../infra/repository/impl/trail.trail.detail.repo.impl');
  await require('../infra/repository/impl/user.repo.impl');
  
  // 2. Service
  await require('../app/service/impl/bill.board.service.impl');
  await require('../app/service/impl/category.service.impl');
  await require('../app/service/impl/cart.service.impl');
  await require('../app/service/impl/cart.product.service.impl');
  await require('../app/service/impl/home.service.impl');
  await require('../app/service/impl/media.service.impl');
  await require('../app/service/impl/option.type.service.impl');
  await require('../app/service/impl/section.service.impl');
  await require('../app/service/impl/section.trail.service.impl');
  await require('../app/service/impl/token.service.impl');
  await require('../app/service/impl/trail.service.impl');
  await require('../app/service/impl/trail.detail.service.impl');
  await require('../app/service/impl/trail.trail.detail.service.impl');
  await require('../app/service/impl/user.service.impl');
  
  await container.loadAsync(bindings);

  container.load(buildProviderModule());
  return container;
};
