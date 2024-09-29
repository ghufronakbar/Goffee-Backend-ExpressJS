'use strict';

const connection = require('../../connection');

exports.infoPayment = async (req, res) => {
    connection.query(`SELECT * FROM informations WHERE id_information=1`,
        (error, rows, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                return res.json({ rows });
            }
        }
    )
}

exports.editPaymnet = async (req, res) => {
    const { bank_name, bank_account } = req.body
    connection.query(`UPDATE informations SET bank_name=?,bank_account=?`, [bank_name, bank_account],
        (error, rows, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                return res.status(200).json({ status: 200, message: "Information payment successfully update" });
            }
        }
    )
}

