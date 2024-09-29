'use strict';

const connection = require('../../connection');

exports.infoPayment = async (req, res) => {
    connection.query(`SELECT * FROM informations WHERE id_information=1`,
        (error, rows, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
            } else {
                return res.json({ status: 200, values: rows[0] });
            }
        }
    )
}

