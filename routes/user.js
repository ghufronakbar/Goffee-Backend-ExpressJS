"use strict";

const verifikasiUser = require("../middleware/verifikasi-user");

module.exports = function (app) {
  let api_user = require("../controllers/user");

  // ACCOUNT CONTROLLER

  app.route("/api/user/register").post(api_user.account_controller.register);

  app.route("/api/user/login").post(api_user.account_controller.login);

  app
    .route("/api/user/check")
    .get(verifikasiUser, api_user.account_controller.check_user); //SEPERTINYA TIDAK PERLU KARENA SUDAH ADA MIDDLEWARE YANG MENANGANI UNTUK SETIAP FUNGSI

  app
    .route("/api/user/profile")
    .get(verifikasiUser, api_user.account_controller.profile);

  app
    .route("/api/user/profile/edit")
    .put(verifikasiUser, api_user.account_controller.editProfile);

  app
    .route("/api/user/profile/password")
    .put(verifikasiUser, api_user.account_controller.editPassword);

      // INFORMATION CONTROLLER
  app
    .route(`/api/user/information`)
    .get(api_user.information_controller.infoPayment);

  //MENU CONTROLLER
  app
    .route("/api/user/products/recommended")
    .get(verifikasiUser, api_user.menu_controller.menuRecommended);

  app
    .route("/api/user/products/")
    .get(verifikasiUser, api_user.menu_controller.menu);

  app
    .route("/api/user/products/ice")
    .get(verifikasiUser, api_user.menu_controller.menuIce);

  app
    .route("/api/user/products/hot")
    .get(verifikasiUser, api_user.menu_controller.menuHot);

  app
    .route("/api/user/products/recommended/ice")
    .get(verifikasiUser, api_user.menu_controller.recomendedMenuIce);

  app
    .route("/api/user/products/recommended/hot")
    .get(verifikasiUser, api_user.menu_controller.recomendedMenuHot);

  app
    .route("/api/user/product/:id_menu")
    .get(verifikasiUser, api_user.menu_controller.menu_id);

  // ORDER CONTROLLER
  app
    .route("/api/user/orders")
    .get(verifikasiUser, api_user.order_controller.orderAll);

  app
    .route("/api/user/orders/pending")
    .get(verifikasiUser, api_user.order_controller.orderPending);

  app
    .route("/api/user/orders/cancel-by-user")
    .get(verifikasiUser, api_user.order_controller.orderCBU);

  app
    .route("/api/user/orders/cancel-by-admin")
    .get(verifikasiUser, api_user.order_controller.orderCBA);

  app
    .route("/api/user/orders/paid")
    .get(verifikasiUser, api_user.order_controller.orderPaid);

  app
    .route("/api/user/orders/process")
    .get(verifikasiUser, api_user.order_controller.orderProcess);

  app
    .route("/api/user/orders/ready")
    .get(verifikasiUser, api_user.order_controller.orderReady);

  app
    .route("/api/user/orders/done")
    .get(verifikasiUser, api_user.order_controller.orderDone);

  app
    .route("/api/user/order/:id_history")
    .get(verifikasiUser, api_user.order_controller.orderId);

  // CART CONTROLLER
  app
    .route("/api/user/cart")
    .get(verifikasiUser, api_user.cart_controller.cartUser);

  app
    .route("/api/user/cart/item/setamount")
    .put(verifikasiUser, api_user.cart_controller.cartSetAmount);

  app
    .route("/api/user/cart/item/delete/:id_cart_item")
    .delete(verifikasiUser, api_user.cart_controller.cartDeleteItem);

  app
    .route("/api/user/cart/item/add-to-cart")
    .post(verifikasiUser, api_user.cart_controller.addToCart);

  // CHECKOUT CONTROLLER
  app
    .route("/api/user/checkout")
    .post(verifikasiUser, api_user.checkout_controller.checkoutCart);

  app
    .route("/api/user/confirm/:id_history")
    .put(verifikasiUser, api_user.checkout_controller.confirmOrder);

  app
    .route("/api/user/cancel/:id_history")
    .put(verifikasiUser, api_user.checkout_controller.cancelOrder);


  // CHECKOUT CONTROLLER
  app.route('/api/user/checkout')
    .post(verifikasiUser, api_user.checkout_controller.checkoutCart);

  app.route('/api/user/confirm/:id_history')
    .put(verifikasiUser, api_user.checkout_controller.confirmOrder);

  app.route('/api/user/cancel/:id_history')
    .put(verifikasiUser, api_user.checkout_controller.cancelOrder);
};

