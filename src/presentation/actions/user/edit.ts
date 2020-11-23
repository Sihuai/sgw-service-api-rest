// import { inject } from 'inversify';
// import { provide } from 'inversify-binding-decorators';
// import { IAction } from '../../../app/interfaces/action';
// import { UserService } from '../../../app/service/user.service';
// import { IOC_TYPE } from '../../../config/type';
// import { IUserDTO } from '../../../domain/models/user';
// import { INullable } from '../../../infra/utils/types';

// interface IRequest extends INullable<IUserDTO> {
//   email: string;
// }

// @provide(IOC_TYPE.EditUserPWRequestAction, true)
// @provide('action', true)
// export class EditUserPWRequestAction implements IAction {
//   payloadExample = `
//     "email": "email@sgw.com",
//   `;
//   description = '';
//   constructor(
//     @inject(IOC_TYPE.UserService) public userService: UserService,
//   ) { }
//   execute(request: IRequest) {
    


//     const filters = {email:request.email};

//     return this.userService.resetpwrequest(request);
//   }
// }

// @provide(IOC_TYPE.EditUserPWExecuteAction, true)
// @provide('action', true)
// export class EditUserPWExecuteAction implements IAction {
//   payloadExample = `
//     "email": "email@sgw.com",
//     "code"?: "1234",
//     "pwhash"?: "new body",
//   `;
//   description = '';
//   constructor(
//     @inject(IOC_TYPE.UserService) public userService: UserService,
//   ) { }
//   execute(request: IRequest) {
//     const filters = {email:request.email};

//     return this.userService.resetpwexecute(request);
//   }
// }