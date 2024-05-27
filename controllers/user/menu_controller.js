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
  await connection.query(
    `SELECT * FROM menus WHERE status>0 ORDER BY RAND() LIMIT 4`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};
exports.menu = async (req, res) => {
  await connection.query(
    `SELECT * FROM menus WHERE status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};

exports.menuIce = async (req, res) => {
  await connection.query(
    `SELECT * FROM menus WHERE variant='Ice' AND status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};

exports.recomendedMenuIce = async (req, res) => {
  await connection.query(
    `SELECT * FROM menus WHERE variant='Ice' AND status>0 ORDER BY RAND() LIMIT 3`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};

exports.menuHot = async (req, res) => {
  await connection.query(
    `SELECT * FROM menus WHERE variant='Hot' AND status>0`,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
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
        response.ok(rows, res);
      }
    }
  );
};

exports.menu_id = async (req, res) => {
  let id_menu = req.params.id_menu;
  await connection.query(
    `SELECT * FROM menus WHERE id_menu=?`,
    [id_menu],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};
