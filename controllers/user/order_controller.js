'use strict';

const connection = require('../../connection');
const urlGoogleMaps = require('../../utils/urlGoogleMaps');

exports.orderAll = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? ORDER BY ordered_at DESC`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                for (const r of rows) {
                    r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                }
                res.json({ status: 200, values: rows })
            };
        }
    )
}


exports.orderPending = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=0 ORDER BY ordered_at DESC`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                for (const r of rows) {
                    r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                }
                return res.json({ status: 200, values: rows })

            };
        }
    )
}
exports.orderProcess = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND (status=3 OR status=4 OR status=5) ORDER BY ordered_at DESC`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                    res.json({ status: 204, values: [] });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
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
                    res.json({ status: 204, message: "There's no order canceled by you" });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
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
                    res.json({ status: 204, message: "There's no order canceled by admin" });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
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
                    res.json({ status: 204, message: "There's no paid order" });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
                }
            };
        }
    )
}


// exports.orderProcess = async (req, res) => {
//     const id_user = req.decoded.id_user;
//     await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=4`, [id_user],
//         function (error, rows, fields) {
//             if (error) {
//                 console.log(error)
//             } else {
//                 if (rows.length == 0) {
//                      res.json({status: 204, message:"There's no proceed order"});
//                 } else if(rows.length > 0){
//                     res.json({status:200, values:rows})                    
//                 }
//             };
//         }
//     )
// }



exports.orderReady = async (req, res) => {
    const id_user = req.decoded.id_user;
    await connection.query(`SELECT * FROM histories WHERE id_user=? AND status=5`, [id_user],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length == 0) {
                    res.json({ status: 204, message: "There's no ready order" });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
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
                    res.json({ status: 204, message: "There's no finished order" });
                } else if (rows.length > 0) {
                    for (const r of rows) {
                        r.urlGoogleMaps = r.latitude !== null && r.longitude !== null ? urlGoogleMaps(r.latitude, r.longitude) : null
                    }
                    res.json({ status: 200, values: rows })
                }
            };
        }
    )
}


exports.orderId = async (req, res) => {
    const id_history = req.params.id_history;
    await connection.query(`SELECT * FROM histories WHERE id_history=?`, [id_history],
        async function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                if (rows.length == 0) {
                    res.json({ status: 400, message: "There's no data" });
                } else if (rows.length > 0) {
                    const history = rows[0];
                    connection.query(`SELECT * FROM item_histories WHERE id_history=?`, [id_history],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.json({ status: 500, message: "Internal server error" });
                            } else {
                                history.urlGoogleMaps = history.latitude !== null && history.longitude !== null ? urlGoogleMaps(history.latitude, history.longitude) : null
                                res.json({ status: 200, values: { history: history, menu: rows } });
                            }
                        }
                    );
                }
            }
        }
    );
};
