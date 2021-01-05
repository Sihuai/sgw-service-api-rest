export const IOC_TYPE = {
  // 1. Repository
  AddressRepoImpl: Symbol.for('AddressRepoImpl'),
  AnimationPlaybackRepoImpl: Symbol.for('AnimationPlaybackRepoImpl'),
  BillBoardRepoImpl: Symbol.for('BillBoardRepoImpl'),
  CategoryRepoImpl: Symbol.for('CategoryRepoImpl'),
  CartItemRepoImpl: Symbol.for('CartItemRepoImpl'),
  CartTrailProductRepoImpl: Symbol.for('CartTrailProductRepoImpl'),
  CartItemOrderItemRepoImpl: Symbol.for('CartItemOrderItemRepoImpl'),
  MediaRepoImpl: Symbol.for('MediaRepoImpl'),
  OptionTypeRepoImpl: Symbol.for('OptionTypeRepoImpl'),
  OrderRepoImpl: Symbol.for('OrderRepoImpl'),
  OrderItemRepoImpl: Symbol.for('OrderItemRepoImpl'),
  OrderOrderItemRepoImpl: Symbol.for('OrderOrderItemRepoImpl'),
  OrderAddressRepoImpl: Symbol.for('OrderAddressRepoImpl'),
  OrderPaymentTransactionRepoImpl: Symbol.for('OrderPaymentTransactionRepoImpl'),
  OrderItemUserAnimationPlaybackRepoImpl: Symbol.for('OrderItemUserAnimationPlaybackRepoImpl'),
  PaymentAccountRepoImpl: Symbol.for('PaymentAccountRepoImpl'),
  PaymentTransactionRepoImpl: Symbol.for('PaymentTransactionRepoImpl'),
  ProductRepoImpl: Symbol.for('ProductRepoImpl'),
  ProductCategoryRepoImpl: Symbol.for('ProductCategoryRepoImpl'),
  ProductProductCategoryRepoImpl: Symbol.for('ProductProductCategoryRepoImpl'),
  SectionRepoImpl: Symbol.for('SectionRepoImpl'),
  SectionTrailRepoImpl: Symbol.for('SectionTrailRepoImpl'),
  ShopRepoImpl: Symbol.for('ShopRepoImpl'),
  ShopProductRepoImpl: Symbol.for('ShopProductRepoImpl'),
  TrailRepoImpl: Symbol.for('TrailRepoImpl'),
  TrailDetailRepoImpl: Symbol.for('TrailDetailRepoImpl'),
  TrailTrailDetailRepoImpl: Symbol.for('TrailTrailDetailRepoImpl'),
  TrailAnimationPlaybackRepoImpl: Symbol.for('TrailAnimationPlaybackRepoImpl'),
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
  PagingSectionAction : Symbol.for('PagingSectionAction'),
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
  CreateTrailAnimationPlaybackAction : Symbol.for('CreateTrailAnimationPlaybackAction'),
  DeleteTrailAnimationPlaybackAction : Symbol.for('DeleteTrailAnimationPlaybackAction'),
  MyTrailAction : Symbol.for('MyTrailAction'),
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
  MyAnimationPlaybackAction : Symbol.for('MyAnimationPlaybackAction'),
  NextAnimationPlaybackAction : Symbol.for('NextAnimationPlaybackAction'),
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
  // - Product
  CreateProductAction : Symbol.for('CreateProductAction'),
  EditProductAction : Symbol.for('EditProductAction'),
  GetProductAction : Symbol.for('GetProductAction'),
  DeleteProductAction : Symbol.for('DeleteProductAction'),
  RemoveFromCategoryAction : Symbol.for('RemoveFromCategoryAction'),
  AddToCategoryAction : Symbol.for('AddToCategoryAction'),
  // - Product Category
  CreateProductCategoryAction : Symbol.for('CreateProductCategoryAction'),
  EditProductCategoryAction : Symbol.for('EditProductCategoryAction'),
  GetProductCategoryAction : Symbol.for('GetProductCategoryAction'),
  DeleteProductCategoryAction : Symbol.for('DeleteProductCategoryAction'),
  // - Shop
  GetShopAction : Symbol.for('GetShopAction'),
  EditShopAction : Symbol.for('EditShopAction'),
  DeleteShopAction : Symbol.for('DeleteShopAction'),
  CreateShopAction : Symbol.for('CreateShopAction'),
  
  RemoveProductAction : Symbol.for('RemoveProductAction'),
  AddProductAction : Symbol.for('AddProductAction'),

  // 3. Service
  AddressServiceImpl: Symbol.for('AddressServiceImpl'),
  AnimationPlaybackServiceImpl: Symbol.for('AnimationPlaybackServiceImpl'),
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  CategoryServiceImpl: Symbol.for('CategoryServiceImpl'),
  CartItemServiceImpl: Symbol.for('CartItemServiceImpl'),
  CartItemDetailServiceImpl: Symbol.for('CartItemDetailServiceImpl'),
  CartTrailProductServiceImpl: Symbol.for('CartTrailProductServiceImpl'),
  CartItemOrderItemServiceImpl: Symbol.for('CartItemOrderItemServiceImpl'),
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  MediaServiceImpl: Symbol.for('MediaServiceImpl'),
  OptionTypeServiceImpl: Symbol.for('OptionTypeServiceImpl'),
  OrderServiceImpl: Symbol.for('OrderServiceImpl'),
  OrderItemServiceImpl: Symbol.for('OrderItemServiceImpl'),
  OrderOrderItemServiceImpl: Symbol.for('OrderOrderItemServiceImpl'),
  OrderAddressServiceImpl: Symbol.for('OrderAddressServiceImpl'),
  OrderPaymentTransactionServiceImpl: Symbol.for('OrderPaymentTransactionServiceImpl'),
  OrderItemUserAnimationPlaybackServiceImpl: Symbol.for('OrderItemUserAnimationPlaybackServiceImpl'),
  PaymentAccountServiceImpl: Symbol.for('PaymentAccountServiceImpl'),
  PaymentTransactionServiceImpl: Symbol.for('PaymentTransactionServiceImpl'),
  ProductServiceImpl: Symbol.for('ProductServiceImpl'),
  ProductCategoryServiceImpl: Symbol.for('ProductCategoryServiceImpl'),
  ProductProductCategoryServiceImpl: Symbol.for('ProductProductCategoryServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
  SectionTrailServiceImpl: Symbol.for('SectionTrailServiceImpl'),
  ShopServiceImpl: Symbol.for('ShopServiceImpl'),
  ShopProductServiceImpl: Symbol.for('ShopProductServiceImpl'),
  StripeServiceImpl: Symbol.for('StripeServiceImpl'),
  TrailServiceImpl: Symbol.for('TrailServiceImpl'),
  TrailDetailServiceImpl: Symbol.for('TrailDetailServiceImpl'),
  TrailTrailDetailServiceImpl: Symbol.for('TrailTrailDetailServiceImpl'),
  TrailAnimationPlaybackServiceImpl: Symbol.for('TrailAnimationPlaybackServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  UserServiceImpl: Symbol.for('UserServiceImpl'),
  UserAddressServiceImpl: Symbol.for('UserAddressServiceImpl'),
  UserAnimationPlaybackServiceImpl: Symbol.for('UserAnimationPlaybackServiceImpl'),
  UserPaymentAccountServiceImpl: Symbol.for('UserPaymentAccountServiceImpl'),
};