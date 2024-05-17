'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
var ip = require('ip');
var config = require('../../config/secret')
var jwt = require('jsonwebtoken');
var mysql = require('mysql');

//Total Done
exports.totalDone = function (req, res) {
    connection.query(`SELECT COUNT(status) AS total_order FROM histories WHERE status=6`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};


//Total Done Today
exports.totalIncomeToday = function (req, res) {
    let now = new Date();
    let dateNow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);

    connection.query(`SELECT COUNT(status) AS total_order, SUM(total) AS total_income FROM histories WHERE status=6 AND DATE(finished_at) = ?`,
        [dateNow],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

//Total Done This Month
exports.totalIncomeMonth = function (req, res) {
    let now = new Date();
    let thisMonth = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2);

    connection.query(`SELECT COUNT(status) AS total_order, SUM(total) AS total_income FROM histories WHERE status=6 AND DATE_FORMAT(finished_at, '%Y-%m') = ?`,
        [thisMonth],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

exports.totalIncomeMonthly = function (req, res) {
    // Mendapatkan tanggal 12 bulan yang lalu dari tanggal sekarang
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const formattedDate = twelveMonthsAgo.toISOString().slice(0, 7); // Format YYYY-MM

    connection.query(
        `SELECT DATE_FORMAT(h.finished_at, '%Y-%m') AS month,
        COUNT(h.status) AS total_order,
        SUM(h.total) AS total_income,
        (SELECT SUM(amount) FROM item_histories WHERE id_history = h.id_history) AS total_item
 FROM histories AS h
 WHERE h.status = 6
   AND h.finished_at IS NOT NULL
   AND h.finished_at >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
 GROUP BY month
 
 `,
        [formattedDate],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.error("An error occurred", res);
            } else {
                // Mengelompokkan hasil berdasarkan bulan dan tahun
                let monthlyData = {};
                rows.forEach((row) => {
                    const month = row.month;
                    delete row.month;
                    if (!monthlyData[month]) {
                        monthlyData[month] = [];
                    }
                    monthlyData[month].push(row);
                });

                response.ok(monthlyData, res);
            }
        }
    );
};



exports.totalIncomeDaily = function (req, res) {
    connection.query(`SELECT DATE_FORMAT(h.finished_at, '%Y-%m-%d') AS date,
                            COUNT(h.status) AS total_order,
                            SUM(h.total) AS total_income,
                            (SELECT SUM(amount) FROM item_histories WHERE id_history = h.id_history) AS total_item
                        FROM histories AS h
                        WHERE h.status = 6
                            AND h.finished_at IS NOT NULL
                        GROUP BY date`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                // Mengelompokkan hasil berdasarkan tanggal
                let dailyData = {};
                rows.forEach(row => {
                    const date = row.date;
                    delete row.date;
                    if (!dailyData[date]) {
                        dailyData[date] = [];
                    }
                    dailyData[date].push(row);
                });

                response.ok(dailyData, res);
            };
        }
    );
};
