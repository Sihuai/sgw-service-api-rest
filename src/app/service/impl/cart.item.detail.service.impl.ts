import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartItemDetail } from '../../../domain/models/cart.item.detail';
import { CartItemDetailRepo } from '../../../infra/repository/cart.item.detail.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CartItemDetailService } from '../cart.item.detail.service';
import { CartItemService } from '../cart.item.service';
import { CartTrailProductService } from '../cart.trail.product.service';
import { TrailDetailService } from '../trail.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartItemDetailServiceImpl)
export class CartItemDetailServiceImpl extends AbstractBaseService<CartItemDetail> implements CartItemDetailService {
  constructor(
    @inject(IOC_TYPE.CartItemDetailRepoImpl) private cartItemDetailRepo: CartItemDetailRepo,
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
    @inject(IOC_TYPE.CartTrailProductServiceImpl) private cartTrailProductService: CartTrailProductService,
    @inject(IOC_TYPE.TrailDetailServiceImpl) private trailDetailService: TrailDetailService,
  ) {
    super();
  }

  async findAll() : Promise<CartItemDetail[]> {
    return await this.cartItemDetailRepo.selectAll();
  }

  async findAllBy(filters) : Promise<CartItemDetail> {
    return await this.cartItemDetailRepo.selectAllBy(filters);
  }

  async findAllByKey(filters) : Promise<any> {
    return await this.cartItemDetailRepo.selectAllByKey(filters);
  }

  async findOneBy(cartItemKey: string) : Promise<CartItemDetail> {
    // 1. Get cart item.
    const ciResult = await this.cartItemService.findAllByKey(cartItemKey);
    // 2. Get cart trail product edge
    const ctpFilters = {_to: 'CartItem/' + cartItemKey, isActive: true};
    const ctpResult = await this.cartTrailProductService.findOneBy(ctpFilters);

    // 3. Map
    const cartItemDetail = new CartItemDetail();
    cartItemDetail.type = ciResult[0].type;
    cartItemDetail.name = ciResult[0].name;
    cartItemDetail.description = ciResult[0].description;
    cartItemDetail.uri = ciResult[0].uri;
    cartItemDetail.qty = ciResult[0].qty;
    cartItemDetail.uom = ciResult[0].uom;
    cartItemDetail.tag = ciResult[0].tag;
    cartItemDetail.price = ciResult[0].price;

    // 3.1. Get trail/product detail
    var ptResult;
    switch(ciResult[0].type)
      {
        case 'PRODUCT':
          break;
        case 'TRAIL':
          ptResult = await this.trailDetailService.findAllByKey(ctpResult._from);

          for (let persona of ptResult[0].personas) {
            for (let content of persona.contents) {
              if (content.sequence == ciResult[0].options.persona.type) {
                content.selected == true;
              } else {
                content.selected == false;
              }
            }
          }

          cartItemDetail.options.personas = ptResult[0].personas;
          break;
      }

    return cartItemDetail;
  }

  async countBy(filters) : Promise<any> {
    return await this.cartItemDetailRepo.countBy(filters);
  }

  async addOne(model: CartItemDetail): Promise<any> {
    try {
      const cartResult = await this.cartItemDetailRepo.insert(model);
      if (isEmptyObject(cartResult) == true) return -11;

      return cartResult;
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(model: CartItemDetail): Promise<any> {
    try {
      const filters = {_key: model._key};
      const isExisted = await this.cartItemDetailRepo.existsBy(filters);
      if (isExisted == false) return -10;

      return await this.cartItemDetailRepo.update(model);
    } catch (e) {
      throw e;
    }
  }

  async removeOne(model: CartItemDetail): Promise<any> {
    try {
      const cartFilters = {_key: model._key};
      const cartResult = await this.cartItemDetailRepo.selectOneBy(cartFilters);
      if (isEmptyObject(cartResult) == true) return -10;

      // const cpFilters = {_to: cartResult._id};
      // const cpResult = await this.cartProductService.removeBy(cpFilters);
      // if (isEmptyObject(cpResult) == true) return -10;
      // if (cpResult.code != 200) return -10;
      // if (cpResult == -10) return -10;

      return await this.cartItemDetailRepo.deleteByKey(cartFilters._key);
    } catch (e) {
      throw e;
    }
  }
}