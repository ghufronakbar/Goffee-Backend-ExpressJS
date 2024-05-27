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


exports.cartUser = async (req, res) => {
    const id_user = req.decoded.id_user;
    const query = `
        SELECT 
            c.id_cart, 
            c.id_user, 
            i.id_cart_item, 
            i.id_menu, 
            i.amount,
            m.menu_name, 
            m.variant, 
            m.information, 
            m.picture, 
            m.price, 
            m.status 
        FROM 
            carts AS c 
        JOIN 
            cart_items AS i ON c.id_cart = i.id_cart 
        JOIN 
            menus AS m ON i.id_menu = m.id_menu
        WHERE 
            c.id_user = ?
    `;

    connection.query(query, [id_user], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            if (rows.length == 0) {
                res.status(204).json({ status: 204, message: "There's no item in cart" });
            } else if (rows.length > 0) {
                const result = rows.reduce((acc, row) => {
                    const { id_cart, id_user, ...item } = row;
                    item.checkoutable = item.status;
                    if (!acc[id_cart]) {
                        acc[id_cart] = {
                            id_cart,
                            id_user,
                            checkoutable: true,
                            cart_item: []
                        };
                    }
                    acc[id_cart].cart_item.push(item);
                    if (!item.checkoutable) {
                        acc[id_cart].checkoutable = false;
                    } 
                    return acc;
                }, {});
                res.status(200).json({
                    status: 200,
                    values: Object.values(result)
                });
            }
        }
    });
};


exports.cartSetAmount = async (req, res) => {
    const amount = parseInt(req.body.amount);
    const id_cart_item = req.body.id_cart_item;

    const query_select_item = `SELECT * FROM cart_items WHERE id_cart_item=?`;
    connection.query(query_select_item, [id_cart_item], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
            if (rows.length === 0) {
                return res.status(404).json({ status: 404, message: "Cart item not found" });
            }
            const current_amount = parseInt(rows[0].amount);
            const total_amount = amount;

            if (total_amount < 1) {
                const query_delete_item = `DELETE FROM cart_items WHERE id_cart_item=?`
                connection.query(query_delete_item, [id_cart_item],
                    function (error, result) {
                        if (error) {
                            console.log(error);
                            res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                            res.status(201).json({
                                status: 201,
                                message: "Item has been deleted"
                            });
                        }
                    }
                )
            } else {
                const query_set_amount = `UPDATE cart_items SET amount=? WHERE id_cart_item=?`;
                connection.query(query_set_amount, [total_amount, id_cart_item], function (error, result) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ status: 500, message: "Internal Server Error" });
                    } else {
                        res.status(200).json({
                            status: 200,
                            message: "Amount has been set"
                        });
                    }
                });
            }
        }
    });
};


exports.cartDeleteItem = async (req, res) => {
    const id_cart_item = req.params.id_cart_item;
    const query_delete_item = `DELETE FROM cart_items WHERE id_cart_item=?`
    connection.query(query_delete_item, [id_cart_item],
        function (error, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Item has been deleted"
                });
            }
        }
    )
};


exports.addToCart = async (req, res) => {
    const id_user = req.decoded.id_user;
    const id_menu = req.body.id_menu

    const qValidation = `SELECT id_cart_item, amount FROM cart_items WHERE id_menu=? AND id_cart=?`
    connection.query(qValidation, [id_menu, id_user],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                const isMenuExist = rows.length

                if (isMenuExist) {
                    const id_cart_item = rows[0].id_cart_item
                    const amount = parseInt(rows[0].amount) + 1
                    const qIncrement = `UPDATE cart_items SET amount=? WHERE id_cart_item=?`
                    connection.query(qIncrement, [amount, id_cart_item],
                        function (error, rows, result) {
                            if (error) {
                                console.log(error);
                                res.status(500).json({ status: 500, message: "Internal Server Error" });
                            } else {
                                res.status(200).json({
                                    status: 200,
                                    message: "Jumlah Item telah ditambahkan ke keranjang"
                                })
                            }
                        }
                    )
                } else {
                    const add_query = `INSERT INTO cart_items(id_menu,id_cart,amount) VALUES(?,?,?)`
                    connection.query(add_query, [id_menu, id_user, 1],
                        function (error, rows, result) {
                            if (error) {
                                console.log(error);
                                res.status(500).json({ status: 500, message: "Internal Server Error" });
                            } else {
                                res.status(200).json({
                                    status: 200,
                                    message: "Item telah ditambahkan ke keranjang"
                                });
                            }
                        }
                    )
                }
            }
        }
    )
}