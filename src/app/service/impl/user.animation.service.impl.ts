import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { IOC_TYPE } from '../../../config/type';
import { UserAnimation } from '../../../domain/models/user.animation';
import { UserWallet } from '../../../domain/models/user.wallet';
import { UserAnimationRepo } from '../../../infra/repository/user.animation.repo';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { AppErrorAlreadyExist } from '../../errors/already.exists';
import { CouponService } from '../coupon.service';
import { GenericEdgeService } from '../generic.edge.service';
import { OrderItemUserAnimationService } from '../order.item.user.animation.service';
import { UserAnimationService } from '../user.animation.service';
import { UserWalletService } from '../user.wallet.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.UserAnimationServiceImpl)
export class UserAnimationServiceImpl extends AbstractBaseService<UserAnimation> implements UserAnimationService {
  constructor(
    @inject(IOC_TYPE.UserAnimationRepoImpl) private userAnimationRepo: UserAnimationRepo,
    @inject(IOC_TYPE.OrderItemUserAnimationServiceImpl) private orderItemUserAnimationService: OrderItemUserAnimationService,
    @inject(IOC_TYPE.GenericEdgeServiceImpl) private genericEdgeService: GenericEdgeService,
    @inject(IOC_TYPE.CouponServiceImpl) private couponService: CouponService,
    @inject(IOC_TYPE.UserWalletServiceImpl) private userWalletService: UserWalletService,
  ) {
    super();
  }

  async findAllBy(filters) : Promise<UserAnimation[]> {
    return await this.userAnimationRepo.selectAllBy(filters);
  }

  async findAllByKey(key) : Promise<UserAnimation[]> {
    return await this.userAnimationRepo.selectAllByKey(key);
  }

  async findOneBy(filters) : Promise<UserAnimation> {
    return await this.userAnimationRepo.selectOneBy(filters);
  }

  async addOne(model: UserAnimation): Promise<any> {
    try {
      return await this.userAnimationRepo.insert(model);
    } catch (e) {
      if (e.message.match('duplicate key value violates unique constraint')) throw new AppErrorAlreadyExist(e);
      throw e;
    }
  }

  async editOne(email: string, orderItemKey: string, next: number): Promise<any> {
    try {
      const filters = {_to: 'OrderItem/' + orderItemKey, isActive: true};
      const result = await this.orderItemUserAnimationService.findOneBy(filters);
      if (isEmptyObject(result) == true) return -10;

      // 1. Get user animation
      const uaps = await this.findAllByKey(result._from);

      // 2. Get current shop key
      var currentSequence = 0;
      for (let button of uaps[0].buttons) {
        if (button.sequence == next) {
          currentSequence = button.sequence - 1;
        }
      }
      const sa = await this.genericEdgeService.findOneBy({_to: uaps[0].tag, sequence: currentSequence, isActive:true});

      // 3. Get shop coupon keys
      const css = await this.genericEdgeService.findAllBy({_to: sa._from, isActive:true});

      // 4. Get coupon
      const keys: Array<string> = [];
      for (let cs of css) {
        keys.push(cs._from);
      }
      const coupons = await this.couponService.findAllByKey(keys);

      // 5. Save to user wallet
      const userWallet = new UserWallet();
      userWallet.coupons = coupons;
      userWallet.tag = sa._from;        // Shop Key
      userWallet.userCreated = email;
      userWallet.userLastUpdated = email;
      const userWalletResult = await this.userWalletService.addOne(userWallet);
      if (isEmptyObject(userWalletResult) == true) return -11;
      
      // 6. Udpate button isNext
      for (let button of uaps[0].buttons) {
        if (button.sequence == next) {
          button.isNext = true;

          // 1.1 Update nextPitStop name
          uaps[0].nextPitStop.name = button.tag;
          break;
        } else {
          button.isNext = false;
        }
      }

      uaps[0].datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      uaps[0].userLastUpdated = email;
      
      return await this.userAnimationRepo.update(uaps[0]);
    } catch (e) {
      throw e;
    }
  }
}