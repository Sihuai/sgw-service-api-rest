import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { bindings } from './inversity.config';

export const createContainer = async () => {
  const container = new Container();

  // 1. Repository
  await require('../infra/repository/impl/address.repo.impl');
  await require('../infra/repository/impl/animation.repo.impl');
  await require('../infra/repository/impl/bill.board.repo.impl');
  await require('../infra/repository/impl/category.repo.impl');
  await require('../infra/repository/impl/cart.item.repo.impl');
  await require('../infra/repository/impl/cart.trail.product.repo.impl');
  await require('../infra/repository/impl/cart.item.order.item.repo.impl');
  await require('../infra/repository/impl/coupon.repo.impl');
  await require('../infra/repository/impl/generic.edge.repo.impl');
  await require('../infra/repository/impl/media.repo.impl');
  await require('../infra/repository/impl/option.type.repo.impl');
  await require('../infra/repository/impl/order.repo.impl');
  await require('../infra/repository/impl/order.item.repo.impl');
  await require('../infra/repository/impl/order.item.user.animation.repo.impl');
  await require('../infra/repository/impl/order.address.repo.impl');
  await require('../infra/repository/impl/order.order.item.repo.impl');
  await require('../infra/repository/impl/order.payment.transaction.repo.impl');
  await require('../infra/repository/impl/payment.account.repo.impl');
  await require('../infra/repository/impl/payment.transaction.repo.impl');
  await require('../infra/repository/impl/product.repo.impl');
  await require('../infra/repository/impl/product.brand.repo.impl');
  await require('../infra/repository/impl/product.category.repo.impl');
  await require('../infra/repository/impl/section.repo.impl');
  await require('../infra/repository/impl/shop.repo.impl');
  await require('../infra/repository/impl/shop.product.repo.impl');
  await require('../infra/repository/impl/token.repo.impl');
  await require('../infra/repository/impl/trail.repo.impl');
  await require('../infra/repository/impl/trail.detail.repo.impl');
  await require('../infra/repository/impl/user.repo.impl');
  await require('../infra/repository/impl/user.address.repo.impl');
  await require('../infra/repository/impl/user.animation.repo.impl');
  await require('../infra/repository/impl/user.payment.account.repo.impl');
  await require('../infra/repository/impl/user.wallet.repo.impl');
  
  // 2. Service
  await require('../app/service/impl/address.service.impl');
  await require('../app/service/impl/animation.service.impl');
  await require('../app/service/impl/bill.board.service.impl');
  await require('../app/service/impl/category.service.impl');
  await require('../app/service/impl/cart.item.service.impl');
  await require('../app/service/impl/cart.item.detail.service.impl');
  await require('../app/service/impl/cart.trail.product.service.impl');
  await require('../app/service/impl/cart.item.order.item.service.impl');
  await require('../app/service/impl/coupon.service.impl');
  await require('../app/service/impl/generic.edge.service.impl');
  await require('../app/service/impl/home.service.impl');
  await require('../app/service/impl/media.service.impl');
  await require('../app/service/impl/option.type.service.impl');
  await require('../app/service/impl/order.service.impl');
  await require('../app/service/impl/order.item.service.impl');
  await require('../app/service/impl/order.item.user.animation.service.impl');
  await require('../app/service/impl/order.address.service.impl');
  await require('../app/service/impl/order.order.item.service.impl');
  await require('../app/service/impl/order.payment.transaction.service.impl');
  await require('../app/service/impl/payment.account.service.impl');
  await require('../app/service/impl/payment.transaction.service.impl');
  await require('../app/service/impl/product.service.impl');
  await require('../app/service/impl/product.brand.service.impl');
  await require('../app/service/impl/product.category.service.impl');
  await require('../app/service/impl/section.service.impl');
  await require('../app/service/impl/shop.service.impl');
  await require('../app/service/impl/shop.category.service.impl');
  await require('../app/service/impl/shop.product.service.impl');
  await require('../app/service/impl/token.service.impl');
  await require('../app/service/impl/trail.service.impl');
  await require('../app/service/impl/trail.detail.service.impl');
  await require('../app/service/impl/user.service.impl');
  await require('../app/service/impl/user.address.service.impl');
  await require('../app/service/impl/user.animation.service.impl');
  await require('../app/service/impl/user.payment.account.service.impl');
  await require('../app/service/impl/user.wallet.service.impl');
  await require('../app/third.party/impl/stripe.service.impl');
  
  await container.loadAsync(bindings);

  container.load(buildProviderModule());
  return container;
};
