'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
var ip = require('ip');
var config = require('../../config/secret')
var jwt = require('jsonwebtoken');
var mysql = require('mysql');

//Cancel By Admin
exports.handleCancelByAdmin = function (req, res) {
    let id_history = req.params.id_history
    let admin_notes = req.body.admin_notes
    let now = new Date();
    let dateNow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' +
        ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);

    connection.query(`UPDATE histories SET status=2,admin_notes=?,finished_at=? WHERE id_history=? `,
        [admin_notes, dateNow, id_history],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};


//Process
exports.handleProcess = function (req, res) {
    let id_history = req.params.id_history
    connection.query(`UPDATE histories SET status=4 WHERE id_history=? `, [id_history],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

//Cancel By Admin
exports.handleReady = function (req, res) {
    let id_history = req.params.id_history

    connection.query(`SELECT h.id_history, h.id_user, h.address, u.fullname 
                        FROM histories AS h JOIN users AS u
                        WHERE h.id_user = u.id_user AND id_history=?`
        , [id_history], function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                const address = rows[0].address
                const fullname = rows[0].fullname
                if (address == null) {
                    let msgTakeAway = `Pesananmu sudah siap, ambil segera, Kak ${fullname} !`
                    connection.query(`UPDATE histories SET status=5,admin_notes=? WHERE id_history=? `, [msgTakeAway, id_history],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error)
                            } else {
                                response.ok(rows, res);
                            };
                        }
                    )
                } else {
                    let msgDelivery = `Pesananmu sedang dalam proses pengiriman ke ${address}, Silahkan ditunggu Kak ${fullname} !`
                    connection.query(`UPDATE histories SET status=5,admin_notes=? WHERE id_history=? `, [msgDelivery, id_history],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error)
                            } else {
                                response.ok(rows, res);
                            };
                        }
                    )
                }
            };
        }
    )
};


//Process
exports.handleDone = function (req, res) {
    let id_history = req.params.id_history
    let now = new Date();
    let dateNow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' +
        ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);

    connection.query(`UPDATE histories SET status=6 ,finished_at=? WHERE id_history=? `,
        [dateNow, id_history],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

