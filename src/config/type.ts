export const IOC_TYPE = {
  // 1. Repository
  // TGORMConnection: Symbol.for('TGORMConnection'),
  // SGWORMConnection: Symbol.for('SGWORMConnection'),
  // AuthorRepository: Symbol.for('AuthorRepository'),
  BillBoardRepoImpl: Symbol.for('BillBoardRepoImpl'),
  CardRepoImpl: Symbol.for('CardRepoImpl'),
  CategoryRepoImpl: Symbol.for('CategoryRepoImpl'),
  MediaRepoImpl: Symbol.for('MediaRepoImpl'),
  SectionRepoImpl: Symbol.for('SectionRepoImpl'),
  TokenRepoImpl: Symbol.for('TokenRepoImpl'),
  UserRepoImpl: Symbol.for('UserRepoImpl'),

  // 2. Action
  GetUserAction: Symbol.for('GetUserAction'),
  RegisterUserAction: Symbol.for('RegisterUserAction'),
  SigninAuthAction: Symbol.for('SigninAuthAction'),
  SignoutAuthAction: Symbol.for('SignoutAuthAction'),
  GetTokenAction: Symbol.for('GetTokenAction'),
  ResetPWRequestUserAction : Symbol.for('ResetPWRequestUserAction'),
  ResetPWExecuteUserAction : Symbol.for('ResetPWExecuteUserAction'),
  
  IndexHomeAction: Symbol.for('IndexHomeAction'),

  CreateBillBoardAction: Symbol.for('CreateBillBoardAction'),
  EditBillBoardAction: Symbol.for('EditBillBoardAction'),
  GetBillBoardAction: Symbol.for('GetBillBoardAction'),
  DeleteBillBoardAction : Symbol.for('DeleteBillBoardAction'),

  CreateSectionAction : Symbol.for('CreateSectionAction'),
  EditSectionAction : Symbol.for('EditSectionAction'),
  GetSectionAction : Symbol.for('GetSectionAction'),
  DeleteSectionAction : Symbol.for('DeleteSectionAction'),

  CreateCardAction : Symbol.for('CreateCardAction'),
  EditCardAction : Symbol.for('EditCardAction'),
  GetCardAction : Symbol.for('GetCardAction'),
  DeleteCardAction : Symbol.for('DeleteCardAction'),


  // 3. Service
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  CardServiceImpl: Symbol.for('CardServiceImpl'),
  CategoryServiceImpl: Symbol.for('CategoryServiceImpl'),
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  MediaServiceImpl: Symbol.for('MediaServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  UserServiceImpl: Symbol.for('UserServiceImpl'),
};