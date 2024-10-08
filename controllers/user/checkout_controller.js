'use strict';

const connection = require('../../connection');

exports.checkoutCart = async (req, res) => {
    const id_user = req.decoded.id_user;
    const { address, user_notes, latitude, longitude } = req.body

    let total = 0
    let now = new Date();
    let date_time =
        now.getFullYear() +
        "-" +
        ("0" + (now.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + now.getDate()).slice(-2) +
        " " +
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2);
    const qValidationItem = `SELECT * FROM cart_items WHERE id_cart=?`
    connection.query(qValidationItem, [id_user],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                if (rows.length == 0) {
                    res.status(400).json({ status: 400, message: "Cannot checkout an empty cart" });
                } else {
                    const qItemCart = `SELECT i.id_cart_item, i.id_menu, i.amount, i.id_cart,
                                        m.menu_name, m.price, m.status, m.variant
                                        FROM cart_items AS i JOIN menus AS m
                                        WHERE i.id_menu = m.id_menu AND
                                        i.id_cart=?`
                    connection.query(qItemCart, [id_user],
                        (error, rows, result) => {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ status: 500, message: "Internal Server Error" });
                            } else {
                                const qHistory = `INSERT INTO histories (id_user, address, latitude, longitude, user_notes,status, ordered_at) VALUES(?,?,?,?,?,?,?)`
                                const vHistory = [id_user, address, latitude, longitude, user_notes, 0, date_time]
                                connection.query(qHistory, vHistory,
                                    function (error, r, result) {
                                        if (error) {
                                            console.log(error);
                                            return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                        } else {
                                            const qIndexHistory = `SELECT MAX(id_history) AS id_history FROM histories WHERE id_user=?;`
                                            connection.query(qIndexHistory, [id_user],
                                                function (error, r, result) {
                                                    if (error) {
                                                        console.log(error);
                                                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                                    } else {
                                                        const iHistory = r[0].id_history
                                                        const loop = rows.length
                                                        for (let i = 0; i < loop; i++) {
                                                            let menu_name = rows[i].menu_name
                                                            let variant = rows[i].variant
                                                            let price = rows[i].price
                                                            let amount = rows[i].amount
                                                            let id_menu = rows[i].id_menu
                                                            let status = rows[i].status
                                                            total = total + (price * amount)

                                                            let qItemHistory = `INSERT INTO item_histories(id_history,menu_name,variant,price,amount) VALUES (?,?,?,?,?)`
                                                            connection.query(qItemHistory, [iHistory, menu_name, variant, price, amount],
                                                                function (error, rr, result) {
                                                                    if (error) {
                                                                        console.log(error);
                                                                        return res.status(500).json({ status: 500, message: "Internal Server Error" });
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        if (address) {
                                                            total = total + 5000 //SHIPPING COST
                                                        }
                                                        const randomPrice = Math.floor(Math.random() * 100);
                                                        total = total + randomPrice
                                                        const qTotalHistory = `UPDATE histories SET total=? WHERE id_history=?`
                                                        const vTotalHistory = [total, iHistory]
                                                        connection.query(qTotalHistory, vTotalHistory,
                                                            function (error, rows, result) {
                                                                if (error) {
                                                                    console.log(error);
                                                                    res.status(500).json({ status: 500, message: "Internal Server Error" });
                                                                } else {
                                                                    const qDeleteCartItems = `DELETE FROM cart_items WHERE id_cart=?`
                                                                    connection.query(qDeleteCartItems, [id_user],
                                                                        function (error, rrrr, result) {
                                                                            if (error) {
                                                                                console.log(error);
                                                                                res.status(500).json({ status: 500, message: "Internal Server Error" });
                                                                            } else {
                                                                                connection.query(`SELECT * FROM informations WHERE id_information=1`,
                                                                                    (error, rr, result) => {
                                                                                        if (error) {
                                                                                            console.log(error);
                                                                                            res.status(500).json({ status: 500, message: "Internal Server Error" });
                                                                                        } else {
                                                                                            const { bank_name, bank_account } = rr[0]
                                                                                            res.status(200).json({ status: 200, message: "Checkout succesfully", bank_name, bank_account, total, iHistory });
                                                                                        }
                                                                                    }
                                                                                )
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    }
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }
        }
    )
}


exports.confirmOrder = async (req, res) => {
    const id_history = req.params.id_history
    connection.query(`UPDATE histories SET status=3 WHERE id_history=?`, [id_history],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "Order paid" });
            }
        }
    )
}


exports.cancelOrder = async (req, res) => {
    let now = new Date();
    let date_time =
        now.getFullYear() +
        "-" +
        ("0" + (now.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + now.getDate()).slice(-2) +
        " " +
        ("0" + now.getHours()).slice(-2) +
        ":" +
        ("0" + now.getMinutes()).slice(-2) +
        ":" +
        ("0" + now.getSeconds()).slice(-2);
    const id_history = req.params.id_history
    connection.query(`UPDATE histories SET status=1, finished_at=? WHERE id_history=?`, [date_time, id_history],
        function (error, rows, result) {
            if (error) {
                console.log(error);
                res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                res.status(200).json({ status: 200, message: "Order cancelled" });
            }
        }
    )
}