// import { inject } from 'inversify';
// import { provide } from 'inversify-binding-decorators';
// import { IAction } from '../../../app/interfaces/action';
// import { UserService } from '../../../app/service/user.service';
 
// @provide(IOC_TYPE.ListUserAction, true)
// @provide('action', true)
// export class ListUserAction implements IAction  {
//   payloadExample = '';
//   description = '';
//   constructor(
//     @inject(IOC_TYPE.UserServiceImpl) private userService: UserService,
//   ) {}
//   execute() {
//     return this.userService.list();
//   }
// }
