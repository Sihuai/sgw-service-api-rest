export const IOC_TYPE = {
  // 1. Repository
  AddressRepoImpl: Symbol.for('AddressRepoImpl'),
  AnimationPlaybackRepoImpl: Symbol.for('AnimationPlaybackRepoImpl'),
  BillBoardRepoImpl: Symbol.for('BillBoardRepoImpl'),
  CategoryRepoImpl: Symbol.for('CategoryRepoImpl'),
  CartItemRepoImpl: Symbol.for('CartItemRepoImpl'),
  CartTrailProductRepoImpl: Symbol.for('CartTrailProductRepoImpl'),
  MediaRepoImpl: Symbol.for('MediaRepoImpl'),
  OptionTypeRepoImpl: Symbol.for('OptionTypeRepoImpl'),
  OrderRepoImpl: Symbol.for('OrderRepoImpl'),
  OrderItemRepoImpl: Symbol.for('OrderItemRepoImpl'),
  OrderOrderItemRepoImpl: Symbol.for('OrderOrderItemRepoImpl'),
  OrderAddressRepoImpl: Symbol.for('OrderAddressRepoImpl'),
  OrderPaymentTransactionRepoImpl: Symbol.for('OrderPaymentTransactionRepoImpl'),
  PaymentAccountRepoImpl: Symbol.for('PaymentAccountRepoImpl'),
  PaymentTransactionRepoImpl: Symbol.for('PaymentTransactionRepoImpl'),
  SectionRepoImpl: Symbol.for('SectionRepoImpl'),
  SectionTrailRepoImpl: Symbol.for('SectionTrailRepoImpl'),
  TrailRepoImpl: Symbol.for('TrailRepoImpl'),
  TrailDetailRepoImpl: Symbol.for('TrailDetailRepoImpl'),
  TrailTrailDetailRepoImpl: Symbol.for('TrailTrailDetailRepoImpl'),
  TokenRepoImpl: Symbol.for('TokenRepoImpl'),
  UserRepoImpl: Symbol.for('UserRepoImpl'),
  UserAddressRepoImpl: Symbol.for('UserAddressRepoImpl'),
  UserAnimationPlaybackRepoImpl: Symbol.for('UserAnimationPlaybackRepoImpl'),
  UserPaymentAccountRepoImpl: Symbol.for('UserPaymentAccountRepoImpl'),

  // 2. Action
  // - User
  GetUserAction: Symbol.for('GetUserAction'),
  EditUserAction: Symbol.for('EditUserAction'),
  // - Auth
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
  PagingSectionAction : Symbol.for('PagingSectionAction'),
  DeleteTrailAction : Symbol.for('DeleteTrailAction'),
  // - TrailDetail
  CreateTrailDetailAction : Symbol.for('CreateTrailDetailAction'),
  EditTrailDetailAction : Symbol.for('EditTrailDetailAction'),
  GetTrailDetailAction : Symbol.for('GetTrailDetailAction'),
  DeleteTrailDetailAction : Symbol.for('DeleteTrailDetailAction'),
  // - Cart
  CreateCartAction : Symbol.for('CreateCartAction'),
  EditCartAction : Symbol.for('EditCartAction'),
  GetCartAction : Symbol.for('GetCartAction'),
  DeleteCartAction : Symbol.for('DeleteCartAction'),
  CountCartAction : Symbol.for('CountCartAction'),
  CheckoutCartAction : Symbol.for('CheckoutCartAction'),
  // - CartDetail
  CreateCartDetailAction : Symbol.for('CreateCartDetailAction'),
  EditCartDetailAction : Symbol.for('EditCartDetailAction'),
  GetCartDetailAction : Symbol.for('GetCartDetailAction'),
  DeleteCartDetailAction : Symbol.for('DeleteCartDetailAction'),
  CountCartDetailAction : Symbol.for('CountCartDetailAction'),
  // - Option Type
  CreateOptionTypeAction : Symbol.for('CreateOptionTypeAction'),
  EditOptionTypeAction : Symbol.for('EditOptionTypeAction'),
  GetOptionTypeAction : Symbol.for('GetOptionTypeAction'),
  DeleteOptionTypeAction : Symbol.for('DeleteOptionTypeAction'),
  // - Address
  CreateAddressAction : Symbol.for('CreateAddressAction'),
  EditAddressAction : Symbol.for('EditAddressAction'),
  GetAddressAction : Symbol.for('GetAddressAction'),
  DeleteAddressAction : Symbol.for('DeleteAddressAction'),
  // - Animation Playback
  CreateAnimationPlaybackAction : Symbol.for('CreateAnimationPlaybackAction'),
  EditAnimationPlaybackAction : Symbol.for('EditAnimationPlaybackAction'),
  GetAnimationPlaybackAction : Symbol.for('GetAnimationPlaybackAction'),
  DeleteAnimationPlaybackAction : Symbol.for('DeleteAnimationPlaybackAction'),
  // - Order
  CreateOrderAction : Symbol.for('CreateOrderAction'),
  EditOrderAction : Symbol.for('EditOrderAction'),
  GetOrderAction : Symbol.for('GetOrderAction'),
  DeleteOrderAction : Symbol.for('DeleteOrderAction'),
  PagingOrderAction : Symbol.for('PagingOrderAction'),
  // - Order Detail
  GetOrderDetailAction : Symbol.for('GetOrderDetailAction'),
  // - PaymentAccount
  CreatePaymentAccountAction : Symbol.for('CreatePaymentAccountAction'),
  GetPaymentAccountAction : Symbol.for('GetPaymentAccountAction'),
  DeletePaymentAccountAction : Symbol.for('DeletePaymentAccountAction'),
  RemovePaymentAccountAction : Symbol.for('RemovePaymentAccountAction'),
  // - Payment
  CreatePaymentAction : Symbol.for('CreatePaymentAction'),
  GetPaymentAction : Symbol.for('GetPaymentAction'),

  // 3. Service
  AddressServiceImpl: Symbol.for('AddressServiceImpl'),
  AnimationPlaybackServiceImpl: Symbol.for('AnimationPlaybackServiceImpl'),
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  CategoryServiceImpl: Symbol.for('CategoryServiceImpl'),
  CartItemServiceImpl: Symbol.for('CartItemServiceImpl'),
  CartItemDetailServiceImpl: Symbol.for('CartItemDetailServiceImpl'),
  CartTrailProductServiceImpl: Symbol.for('CartTrailProductServiceImpl'),
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  MediaServiceImpl: Symbol.for('MediaServiceImpl'),
  OptionTypeServiceImpl: Symbol.for('OptionTypeServiceImpl'),
  OrderServiceImpl: Symbol.for('OrderServiceImpl'),
  OrderItemServiceImpl: Symbol.for('OrderItemServiceImpl'),
  OrderOrderItemServiceImpl: Symbol.for('OrderOrderItemServiceImpl'),
  OrderAddressServiceImpl: Symbol.for('OrderAddressServiceImpl'),
  OrderPaymentTransactionServiceImpl: Symbol.for('OrderPaymentTransactionServiceImpl'),
  PaymentAccountServiceImpl: Symbol.for('PaymentAccountServiceImpl'),
  PaymentTransactionServiceImpl: Symbol.for('PaymentTransactionServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
  SectionTrailServiceImpl: Symbol.for('SectionTrailServiceImpl'),
  StripeServiceImpl: Symbol.for('StripeServiceImpl'),
  TrailServiceImpl: Symbol.for('TrailServiceImpl'),
  TrailDetailServiceImpl: Symbol.for('TrailDetailServiceImpl'),
  TrailTrailDetailServiceImpl: Symbol.for('TrailTrailDetailServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  UserServiceImpl: Symbol.for('UserServiceImpl'),
  UserAddressServiceImpl: Symbol.for('UserAddressServiceImpl'),
  UserAnimationPlaybackServiceImpl: Symbol.for('UserAnimationPlaybackServiceImpl'),
  UserPaymentAccountServiceImpl: Symbol.for('UserPaymentAccountServiceImpl'),
};