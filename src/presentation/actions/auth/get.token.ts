// import { inject } from 'inversify';
// import { provide } from 'inversify-binding-decorators';
// import { IAction } from '../../../app/interfaces/action';
// import { TokenService } from '../../../app/service/token.service';
// import { IOC_TYPE } from '../../../config/type';
// import { ITokenDTO } from '../../../domain/models/token';
// import { INullable } from '../../../infra/utils/types';

// interface IRequest extends INullable<ITokenDTO> {
//   email: string;
//   pwhash: string;
// }

// @provide(IOC_TYPE.GetTokenAction, true)
// @provide('action', true)
// export class GetTokenAction implements IAction {
//   payloadExample = `
//     "email": "email@sgw.com",
//     "pwhash": "48ab1d7a4f1d0f231ca46d9cc865c66f",
//   `;
//   description = '';
//   constructor(
//     @inject(IOC_TYPE.TokenService) public tokenService: TokenService,
//   ) { }
//   async execute(request: IRequest) {
//     const filters = {email:request.email, isActive:request.pwhash};
//     return this.tokenService.find(filters);
//   }
// }
