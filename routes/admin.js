"use strict";

// const verifikasi = require("./middleware/verifikasi");

module.exports = function (app) {
  var api_admin = require("../controllers/admin");  


  //LOGIN
  app.route(`/api/admin/login`)
    .post(api_admin.account_controller.login);


  //MENU CONTROLLER

  app.route(`/api/admin/menus`)
    .get(api_admin.menu_controller.menus);

  app.route(`/api/admin/menu/:id_menu`)
    .get(api_admin.menu_controller.menuId);

  app.route(`/api/admin/menu/add`)
    .post(api_admin.menu_controller.menuAdd);

  app.route(`/api/admin/menu/edit/:id_menu`)
    .put(api_admin.menu_controller.menuEdit);

  app.route(`/api/admin/menu/setstock/:id_menu`)
    .put(api_admin.menu_controller.menuSetStock);

  app.route(`/api/admin/menu/delete/:id_menu`)
    .delete(api_admin.menu_controller.menuDelete);


  // ORDER CONTROLLER

  app.route(`/api/admin/orders`)
    .get(api_admin.order_controller.allOrder);

  app.route(`/api/admin/order/:id_history`)
    .get(api_admin.order_controller.orderId);

  app.route(`/api/admin/orders/0`)
    .get(api_admin.order_controller.allOrderPending);

  app.route(`/api/admin/orders/1`)
    .get(api_admin.order_controller.allOrderCancelByUser);

  app.route(`/api/admin/orders/2`)
    .get(api_admin.order_controller.allOrderCancelByAdmin);

  app.route(`/api/admin/orders/3`)
    .get(api_admin.order_controller.allOrderPaid);

  app.route(`/api/admin/orders/4`)
    .get(api_admin.order_controller.allorderprocess);

  app.route(`/api/admin/orders/5`)
    .get(api_admin.order_controller.allOrderReady);

  app.route(`/api/admin/orders/6`)
    .get(api_admin.order_controller.allOrderDone);


  //HANDLE CONTROLLER
  app.route(`/api/admin/order/cancel/:id_history`)
    .put(api_admin.handle_controller.handleCancelByAdmin);

  app.route(`/api/admin/order/process/:id_history`)
    .put(api_admin.handle_controller.handleProcess);

  app.route(`/api/admin/order/ready/:id_history`)
    .put(api_admin.handle_controller.handleReady);

  app.route(`/api/admin/order/done/:id_history`)
    .put(api_admin.handle_controller.handleDone);




  //STATISTIC CONTROLLER
  app.route(`/api/admin/order/total/done`)
    .get(api_admin.statistic_controller.totalDone);

    app.route(`/api/admin/order/total/income/today`)
    .get(api_admin.statistic_controller.totalIncomeToday);

    app.route(`/api/admin/order/total/income/month`)
    .get(api_admin.statistic_controller.totalIncomeMonth);

    app.route(`/api/admin/order/total/income/monthly`)
    .get(api_admin.statistic_controller.totalIncomeMonthly);

    app.route(`/api/admin/order/total/income/daily`)
    .get(api_admin.statistic_controller.totalIncomeDaily);

};

