import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { bindings } from './inversity.config';

export const createContainer = async () => {
  const container = new Container();

  // 1. Repository
  await require('../infra/repository/impl/address.repo.impl');
  await require('../infra/repository/impl/animation.playback.repo.impl');
  await require('../infra/repository/impl/bill.board.repo.impl');
  await require('../infra/repository/impl/category.repo.impl');
  await require('../infra/repository/impl/cart.item.repo.impl');
  await require('../infra/repository/impl/cart.trail.product.repo.impl');
  await require('../infra/repository/impl/media.repo.impl');
  await require('../infra/repository/impl/option.type.repo.impl');
  await require('../infra/repository/impl/section.repo.impl');
  await require('../infra/repository/impl/section.trail.repo.impl');
  await require('../infra/repository/impl/token.repo.impl');
  await require('../infra/repository/impl/trail.repo.impl');
  await require('../infra/repository/impl/trail.detail.repo.impl');
  await require('../infra/repository/impl/trail.trail.detail.repo.impl');
  await require('../infra/repository/impl/user.repo.impl');
  await require('../infra/repository/impl/user.address.repo.impl');
  await require('../infra/repository/impl/user.animation.playback.repo.impl');
  
  // 2. Service
  await require('../app/service/impl/address.service.impl');
  await require('../app/service/impl/animation.playback.service.impl');
  await require('../app/service/impl/bill.board.service.impl');
  await require('../app/service/impl/category.service.impl');
  await require('../app/service/impl/cart.item.service.impl');
  await require('../app/service/impl/cart.item.detail.service.impl');
  await require('../app/service/impl/cart.trail.product.service.impl');
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
  await require('../app/service/impl/user.address.service.impl');
  await require('../app/service/impl/user.animation.playback.service.impl');
  
  await container.loadAsync(bindings);

  container.load(buildProviderModule());
  return container;
};
