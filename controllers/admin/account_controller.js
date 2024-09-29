'use strict';


const connection = require('../../connection');
const md5 = require('md5');
const ip = require('ip');
const config = require('../../config/secret')
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

//LOGIN
exports.login = function (req, res) {
    var post = {
        email: req.body.email,
        password: req.body.password
    }

    var query = "SELECT id_admin FROM ?? WHERE ??=? AND ??=?";
    var table = ["admins", "password", md5(post.password), "email", post.email];

    console.log(post)

    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {
        if (error) {
            console.log(error)
        } else {

            if (rows.length == 0) {

                res.json({
                    "Error": true,
                    "Message": "Emaill or Password doesn't match!"
                })

            } else if (rows.length == 1) {



                var token = jwt.sign({ rows }, config.secret, {
                    expiresIn: 1440
                });
                let id_admin = rows[0].id_admin;

                var data = {
                    id_admin: id_admin,
                    token: token,
                    ip_address: ip.address()
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["akses_token"];

                query = mysql.format(query, table);
                connection.query(query, data, function (error, rows) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.json({
                            success: true,
                            message: "Token JWT Generated!",
                            token: token,
                            currUser: data.id_admin
                        });
                    }
                });
            }

        }
    })
}
