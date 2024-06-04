"use strict";

var response = require("../../res");
var connection = require("../../connection");
var md5 = require("md5");
var ip = require("ip");
var config = require("../../config/secret");
var jwt = require("jsonwebtoken");
var mysql = require("mysql");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

exports.menuRecommended = async (req, res) => {
  connection.query(
    `SELECT id_menu, menu_name, variant, information,picture,price FROM menus WHERE status>0 ORDER BY RAND() LIMIT 4`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};

exports.menu = async (req, res) => {
   connection.query(
    `SELECT * FROM menus WHERE status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};

exports.menuIce = async (req, res) => {
   connection.query(
    `SELECT * FROM menus WHERE variant='Ice' AND status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};

exports.recomendedMenuIce = async (req, res) => {
   connection.query(
    `SELECT * FROM menus WHERE variant='Ice' AND status>0 ORDER BY RAND() LIMIT 3`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};

exports.menuHot = async (req, res) => {
   connection.query(
    `SELECT * FROM menus WHERE variant='Hot' AND status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};
exports.recomendedMenuHot = async (req, res) => {
  await connection.query(
    `SELECT * FROM menus WHERE variant='Hot' AND status>0 ORDER BY RAND() LIMIT 3`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};

exports.menu_id = async (req, res) => {
  let id_menu = req.params.id_menu;
  connection.query(
    `SELECT * FROM menus WHERE id_menu=?`,
    [id_menu],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        let results = [];
        rows.forEach(row => {            
            let item = {
                id_menu: row.id_menu,
                menu_name: row.menu_name,
                variant: row.variant,
                information: row.information,
                picture: process.env.BASE_URL + `/images/menu/`+row.picture,
                price: row.price
            };            
            results.push(item);
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
};
