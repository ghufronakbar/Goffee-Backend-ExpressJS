'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
var ip = require('ip');
var config = require('../../config/secret')
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');


exports.orderAll = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=?`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no orders"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}


exports.orderPending = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=0`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no pending orders"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}

exports.orderCBU = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=1`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no order canceled by you"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}


exports.orderCBA = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=2`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no order canceled by admin"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}

exports.orderPaid = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=3`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no paid order"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}


exports.orderProcess = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=4`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no proceed order"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}



exports.orderReady = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=5`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no ready order"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}


exports.orderDone = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=6`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 204, message:"There's no finished order"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}


exports.orderId = async (req, res) => {    
    const id_history = req.params.id_history
    await connection.query(`SELECT * FROM histories WHERE  id_history=?`, [id_history],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                     res.json({status: 400, message:"There's no data"});
                } else if(rows.length > 0){
                    res.json({status:200, values:rows})                    
                }
            };
        }
    )
}