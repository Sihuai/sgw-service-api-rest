export const IOC_TYPE = {
  // 1. infra
  // ORMConnection: Symbol.for('ORMConnection'),

  // FileFactory: Symbol.for('FileFactory'),

  // AuthorRepository: Symbol.for('AuthorRepository'),

  // 2. app
  // AppConfigService: Symbol.for('AppConfigService'),

  // User
  GetUserAction: Symbol.for('GetUserAction'),
  // Auth
  RegisterUserAction: Symbol.for('RegisterUserAction'),
  SigninAuthAction: Symbol.for('SigninAuthAction'),
  SignoutAuthAction: Symbol.for('SignoutAuthAction'),
  GetTokenAction: Symbol.for('GetTokenAction'),
  // EditUserPWRequestAction: Symbol.for('EditUserPWRequestAction'),
  // EditUserPWExecuteAction: Symbol.for('EditUserPWExecuteAction'),
  // Home
  IndexHomeAction: Symbol.for('IndexHomeAction'),

  // Auth & User
  UserServiceImpl: Symbol.for('UserServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  // Home
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
};