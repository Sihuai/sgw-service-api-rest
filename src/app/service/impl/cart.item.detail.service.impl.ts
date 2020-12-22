import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { CartItemDetail } from '../../../domain/models/cart.item.detail';
import { CartItemDetailService } from '../cart.item.detail.service';
import { CartItemService } from '../cart.item.service';
import { CartTrailProductService } from '../cart.trail.product.service';
import { TrailDetailService } from '../trail.detail.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.CartItemDetailServiceImpl)
export class CartItemDetailServiceImpl extends AbstractBaseService<CartItemDetail> implements CartItemDetailService {
  constructor(
    @inject(IOC_TYPE.CartItemServiceImpl) private cartItemService: CartItemService,
    @inject(IOC_TYPE.CartTrailProductServiceImpl) private cartTrailProductService: CartTrailProductService,
    @inject(IOC_TYPE.TrailDetailServiceImpl) private trailDetailService: TrailDetailService,
  ) {
    super();
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
}