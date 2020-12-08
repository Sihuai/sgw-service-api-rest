export const IOC_TYPE = {
  // 1. Repository
  BillBoardRepoImpl: Symbol.for('BillBoardRepoImpl'),
  CategoryRepoImpl: Symbol.for('CategoryRepoImpl'),
  MediaRepoImpl: Symbol.for('MediaRepoImpl'),
  SectionRepoImpl: Symbol.for('SectionRepoImpl'),
  SectionTrailRepoImpl: Symbol.for('SectionTrailRepoImpl'),
  TrailRepoImpl: Symbol.for('TrailRepoImpl'),
  TrailDetailRepoImpl: Symbol.for('TrailDetailRepoImpl'),
  TrailTrailDetailRepoImpl: Symbol.for('TrailTrailDetailRepoImpl'),
  TokenRepoImpl: Symbol.for('TokenRepoImpl'),
  UserRepoImpl: Symbol.for('UserRepoImpl'),

  // 2. Action
  // - User
  GetUserAction: Symbol.for('GetUserAction'),
  RegisterUserAction: Symbol.for('RegisterUserAction'),
  SigninAuthAction: Symbol.for('SigninAuthAction'),
  SignoutAuthAction: Symbol.for('SignoutAuthAction'),
  GetTokenAction: Symbol.for('GetTokenAction'),
  ResetPWRequestUserAction : Symbol.for('ResetPWRequestUserAction'),
  ResetPWExecuteUserAction : Symbol.for('ResetPWExecuteUserAction'),
  // - Home
  GetHomeAction: Symbol.for('GetHomeAction'),
  // - BillBoard
  CreateBillBoardAction: Symbol.for('CreateBillBoardAction'),
  EditBillBoardAction: Symbol.for('EditBillBoardAction'),
  GetBillBoardAction: Symbol.for('GetBillBoardAction'),
  DeleteBillBoardAction : Symbol.for('DeleteBillBoardAction'),
  // - Section
  CreateSectionAction : Symbol.for('CreateSectionAction'),
  EditSectionAction : Symbol.for('EditSectionAction'),
  GetSectionAction : Symbol.for('GetSectionAction'),
  DeleteSectionAction : Symbol.for('DeleteSectionAction'),
  // - SectionTrail
  CreateSectionTrailAction : Symbol.for('CreateSectionTrailAction'),
  EditSectionTrailAction : Symbol.for('EditSectionTrailAction'),
  GetSectionTrailAction : Symbol.for('GetSectionTrailAction'),
  DeleteSectionTrailAction : Symbol.for('DeleteSectionTrailAction'),
  // - Trail
  CreateTrailAction : Symbol.for('CreateTrailAction'),
  EditTrailAction : Symbol.for('EditTrailAction'),
  GetTrailAction : Symbol.for('GetTrailAction'),
  DeleteTrailAction : Symbol.for('DeleteTrailAction'),
  // - TrailDetail
  CreateTrailDetailAction : Symbol.for('CreateTrailDetailAction'),
  EditTrailDetailAction : Symbol.for('EditTrailDetailAction'),
  GetTrailDetailAction : Symbol.for('GetTrailDetailAction'),
  DeleteTrailDetailAction : Symbol.for('DeleteTrailDetailAction'),

  // 3. Service
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  CategoryServiceImpl: Symbol.for('CategoryServiceImpl'),
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  MediaServiceImpl: Symbol.for('MediaServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
  SectionTrailServiceImpl: Symbol.for('SectionTrailServiceImpl'),
  TrailServiceImpl: Symbol.for('TrailServiceImpl'),
  TrailDetailServiceImpl: Symbol.for('TrailDetailServiceImpl'),
  TrailTrailDetailServiceImpl: Symbol.for('TrailTrailDetailServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  UserServiceImpl: Symbol.for('UserServiceImpl'),
};