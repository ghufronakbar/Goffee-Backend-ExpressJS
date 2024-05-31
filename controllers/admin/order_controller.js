'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
var ip = require('ip');
var config = require('../../config/secret')
var jwt = require('jsonwebtoken');
var mysql = require('mysql');


// ALL HISTORY
exports.allOrder = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
                        h.ordered_at, h.finished_at,u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history 
                        ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};



//  HISTORY id
exports.orderId = function (req, res) {
    let id_history = req.params.id_history
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
                        h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.id_history=?`, [id_history],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};


exports.allOrderPending = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=0  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};



exports.allOrderCancelByUser = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=1  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};


exports.allOrderCancelByAdmin = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=2  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};


exports.allOrderPaid = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=3  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};



exports.allorderprocess = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=4  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};



exports.allOrderReady = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=5  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};


exports.allOrderDone = function (req, res) {
    connection.query(`SELECT h.id_history, h.id_user, h.total, h.address, h.user_notes, h.admin_notes, h.status,
    h.ordered_at, h.finished_at,
                        u.id_user, u.fullname, u.email, u.phone,
                        i.id_item_history, i.menu_name, i.variant, i.price, i.amount
                        FROM histories AS h 
                        JOIN users AS u ON h.id_user = u.id_user
                        JOIN item_histories AS i ON i.id_history = h.id_history WHERE h.status=6  ORDER BY h.id_history DESC`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan id_history menggunakan reduce()
                const groupedRows = rows.reduce((acc, row) => {
                    // Mengecek apakah id_history sudah ada di dalam accumulator
                    const existingHistory = acc.find(item => item.id_history === row.id_history);
                    if (existingHistory) {
                        // Jika sudah ada, tambahkan item ke array item_history
                        existingHistory.item_history.push({
                            id_item_history: row.id_item_history,
                            menu_name: row.menu_name,
                            variant: row.variant,
                            price: row.price,
                            amount: row.amount
                        });
                    } else {
                        // Jika belum ada, tambahkan objek baru ke accumulator
                        acc.push({
                            id_history: row.id_history,
                            id_user: row.id_user,
                            total: row.total,
                            address: row.address,
                            user_notes: row.user_notes,
                            admin_notes: row.admin_notes,
                            status: row.status,
                            fullname: row.fullname,
                            email: row.email,
                            phone: row.phone,
                            ordered_at: row.ordered_at,
                            finished_at: row.finished_at,
                            item_history: [{
                                id_item_history: row.id_item_history,
                                menu_name: row.menu_name,
                                variant: row.variant,
                                price: row.price,
                                amount: row.amount
                            }]
                        });
                    }
                    return acc;
                }, []);
                // Mengirimkan response dengan data yang telah dikelompokkan
                response.ok(groupedRows, res);
            };
        }
    )
};