export const IOC_TYPE = {
  // 1. Repository
  AddressRepoImpl: Symbol.for('AddressRepoImpl'),
  AnimationRepoImpl: Symbol.for('AnimationRepoImpl'),
  BillBoardRepoImpl: Symbol.for('BillBoardRepoImpl'),
  CategoryRepoImpl: Symbol.for('CategoryRepoImpl'),
  CartItemRepoImpl: Symbol.for('CartItemRepoImpl'),
  CartTrailProductRepoImpl: Symbol.for('CartTrailProductRepoImpl'),
  CartItemOrderItemRepoImpl: Symbol.for('CartItemOrderItemRepoImpl'),
  CouponRepoImpl: Symbol.for('CouponRepoImpl'),
  GenericEdgeRepoImpl: Symbol.for('GenericEdgeRepoImpl'),
  MediaRepoImpl: Symbol.for('MediaRepoImpl'),
  OptionTypeRepoImpl: Symbol.for('OptionTypeRepoImpl'),
  OrderRepoImpl: Symbol.for('OrderRepoImpl'),
  OrderItemRepoImpl: Symbol.for('OrderItemRepoImpl'),
  OrderOrderItemRepoImpl: Symbol.for('OrderOrderItemRepoImpl'),
  OrderAddressRepoImpl: Symbol.for('OrderAddressRepoImpl'),
  OrderPaymentTransactionRepoImpl: Symbol.for('OrderPaymentTransactionRepoImpl'),
  OrderItemUserAnimationRepoImpl: Symbol.for('OrderItemUserAnimationRepoImpl'),
  PaymentAccountRepoImpl: Symbol.for('PaymentAccountRepoImpl'),
  PaymentTransactionRepoImpl: Symbol.for('PaymentTransactionRepoImpl'),
  ProductRepoImpl: Symbol.for('ProductRepoImpl'),
  ProductBrandRepoImpl: Symbol.for('ProductBrandRepoImpl'),
  ProductCategoryRepoImpl: Symbol.for('ProductCategoryRepoImpl'),
  SectionRepoImpl: Symbol.for('SectionRepoImpl'),
  ShopRepoImpl: Symbol.for('ShopRepoImpl'),
  ShopProductRepoImpl: Symbol.for('ShopProductRepoImpl'),
  TrailRepoImpl: Symbol.for('TrailRepoImpl'),
  TrailDetailRepoImpl: Symbol.for('TrailDetailRepoImpl'),
  TokenRepoImpl: Symbol.for('TokenRepoImpl'),
  UserRepoImpl: Symbol.for('UserRepoImpl'),
  UserAddressRepoImpl: Symbol.for('UserAddressRepoImpl'),
  UserAnimationRepoImpl: Symbol.for('UserAnimationRepoImpl'),
  UserPaymentAccountRepoImpl: Symbol.for('UserPaymentAccountRepoImpl'),
  UserWalletRepoImpl: Symbol.for('UserWalletRepoImpl'),
  UserAvatarRepoImpl: Symbol.for('UserAvatarRepoImpl'),

  // 2. Action
  // - User
  GetUserAction: Symbol.for('GetUserAction'),
  EditUserAction: Symbol.for('EditUserAction'),
  AvatarUploadAction: Symbol.for('AvatarUploadAction'),
  AvatarGetAction: Symbol.for('AvatarGetAction'),
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
  CreateTrailAnimationAction : Symbol.for('CreateTrailAnimationAction'),
  DeleteTrailAnimationAction : Symbol.for('DeleteTrailAnimationAction'),
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
  AsDefaultAction : Symbol.for('AsDefaultAction'),
  // - Animation Playback
  CreateAnimationAction : Symbol.for('CreateAnimationAction'),
  EditAnimationAction : Symbol.for('EditAnimationAction'),
  GetAnimationAction : Symbol.for('GetAnimationAction'),
  DeleteAnimationAction : Symbol.for('DeleteAnimationAction'),
  MyAnimationAction : Symbol.for('MyAnimationAction'),
  NextAnimationAction : Symbol.for('NextAnimationAction'),
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
  RemoveFromBrandAction : Symbol.for('RemoveFromBrandAction'),
  AddToBrandAction : Symbol.for('AddToBrandAction'),
  GetProductCategoryFromProductAction : Symbol.for('GetProductCategoryFromProductAction'),
  GetProductBrandFromProductAction : Symbol.for('GetProductBrandFromProductAction'),
  // - Product Brand
  CreateProductBrandAction : Symbol.for('CreateProductBrandAction'),
  EditProductBrandAction : Symbol.for('EditProductBrandAction'),
  GetProductBrandAction : Symbol.for('GetProductBrandAction'),
  DeleteProductBrandAction : Symbol.for('DeleteProductBrandAction'),
  RemoveProductFromBrandAction : Symbol.for('RemoveProductFromBrandAction'),
  AddProductToBrandAction : Symbol.for('AddProductToBrandAction'),
  GetProductFromBrandAction : Symbol.for('GetProductFromBrandAction'),
  // - Product Category
  CreateProductCategoryAction : Symbol.for('CreateProductCategoryAction'),
  EditProductCategoryAction : Symbol.for('EditProductCategoryAction'),
  GetProductCategoryAction : Symbol.for('GetProductCategoryAction'),
  DeleteProductCategoryAction : Symbol.for('DeleteProductCategoryAction'),
  RemoveProductFromCategoryAction : Symbol.for('RemoveProductFromCategoryAction'),
  AddProductToCategoryAction : Symbol.for('AddProductToCategoryAction'),
  GetProductFromCategoryAction : Symbol.for('GetProductFromCategoryAction'),
  // - Shop
  GetShopAction : Symbol.for('GetShopAction'),
  EditShopAction : Symbol.for('EditShopAction'),
  DeleteShopAction : Symbol.for('DeleteShopAction'),
  CreateShopAction : Symbol.for('CreateShopAction'),
  RemoveProductFromShopAction : Symbol.for('RemoveProductFromShopAction'),
  AddProductToShopAction : Symbol.for('AddProductToShopAction'),
  GetProductFromShopAction : Symbol.for('GetProductFromShopAction'),
  RemoveFromPitStopAction : Symbol.for('RemoveFromPitStopAction'),
  AddToPitStopAction : Symbol.for('AddToPitStopAction'),
  GetPitStopFromShopAction : Symbol.for('GetPitStopFromShopAction'),
  // - Shop Category
  GetShopCategoryAction : Symbol.for('GetShopCategoryAction'),
  // - Coupon
  CreateCouponAction : Symbol.for('CreateCouponAction'),
  EditCouponAction : Symbol.for('EditCouponAction'),
  GetCouponAction : Symbol.for('GetCouponAction'),
  DeleteCouponAction : Symbol.for('DeleteCouponAction'),
  RemoveFromProductAction : Symbol.for('RemoveFromProductAction'),
  AddToProductAction : Symbol.for('AddToProductAction'),
  GetProductFromCouponAction : Symbol.for('GetProductFromCouponAction'),
  RemoveFromShopAction : Symbol.for('RemoveFromShopAction'),
  AddToShopAction : Symbol.for('AddToShopAction'),
  GetShopFromCouponAction : Symbol.for('GetShopFromCouponAction'),
  // - UserWallet
  GetUserWalletAction : Symbol.for('GetUserWalletAction'),
  DeleteUserWalletAction : Symbol.for('DeleteUserWalletAction'),

  // 3. Service
  AddressServiceImpl: Symbol.for('AddressServiceImpl'),
  AnimationServiceImpl: Symbol.for('AnimationServiceImpl'),
  BillBoardServiceImpl: Symbol.for('BillBoardServiceImpl'),
  CategoryServiceImpl: Symbol.for('CategoryServiceImpl'),
  CartItemServiceImpl: Symbol.for('CartItemServiceImpl'),
  CartItemDetailServiceImpl: Symbol.for('CartItemDetailServiceImpl'),
  CartTrailProductServiceImpl: Symbol.for('CartTrailProductServiceImpl'),
  CartItemOrderItemServiceImpl: Symbol.for('CartItemOrderItemServiceImpl'),
  CouponServiceImpl: Symbol.for('CouponServiceImpl'),
  GenericEdgeServiceImpl: Symbol.for('GenericEdgeServiceImpl'),
  HomeServiceImpl: Symbol.for('HomeServiceImpl'),
  MediaServiceImpl: Symbol.for('MediaServiceImpl'),
  OptionTypeServiceImpl: Symbol.for('OptionTypeServiceImpl'),
  OrderServiceImpl: Symbol.for('OrderServiceImpl'),
  OrderItemServiceImpl: Symbol.for('OrderItemServiceImpl'),
  OrderOrderItemServiceImpl: Symbol.for('OrderOrderItemServiceImpl'),
  OrderAddressServiceImpl: Symbol.for('OrderAddressServiceImpl'),
  OrderPaymentTransactionServiceImpl: Symbol.for('OrderPaymentTransactionServiceImpl'),
  OrderItemUserAnimationServiceImpl: Symbol.for('OrderItemUserAnimationServiceImpl'),
  PaymentAccountServiceImpl: Symbol.for('PaymentAccountServiceImpl'),
  PaymentTransactionServiceImpl: Symbol.for('PaymentTransactionServiceImpl'),
  ProductServiceImpl: Symbol.for('ProductServiceImpl'),
  ProductBrandServiceImpl: Symbol.for('ProductBrandServiceImpl'),
  ProductCategoryServiceImpl: Symbol.for('ProductCategoryServiceImpl'),
  SectionServiceImpl: Symbol.for('SectionServiceImpl'),
  ShopServiceImpl: Symbol.for('ShopServiceImpl'),
  ShopCategoryServiceImpl: Symbol.for('ShopCategoryServiceImpl'),
  ShopProductServiceImpl: Symbol.for('ShopProductServiceImpl'),
  StripeServiceImpl: Symbol.for('StripeServiceImpl'),
  TrailServiceImpl: Symbol.for('TrailServiceImpl'),
  TrailDetailServiceImpl: Symbol.for('TrailDetailServiceImpl'),
  TokenServiceImpl: Symbol.for('TokenServiceImpl'),
  UserServiceImpl: Symbol.for('UserServiceImpl'),
  UserAddressServiceImpl: Symbol.for('UserAddressServiceImpl'),
  UserAnimationServiceImpl: Symbol.for('UserAnimationServiceImpl'),
  UserPaymentAccountServiceImpl: Symbol.for('UserPaymentAccountServiceImpl'),
  UserWalletServiceImpl: Symbol.for('UserWalletServiceImpl'),
  UserAvatarServiceImpl: Symbol.for('UserAvatarServiceImpl'),
};