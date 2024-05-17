'use strict';

const response = require('../../res');
const connection = require('../../connection');
const md5 = require('md5');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../../config/secret');
const ip = require('ip');
const verifikasi = require('../../middleware/verifikasi-user');

// LOGIN
exports.login = function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: 400, message: "Email and password are required" });
  }

  const query = "SELECT email, id_user FROM users WHERE password=? AND email=?";
  const values = [md5(password), email];

  connection.query(query, values, function (error, rows) {
    if (error) {
      console.error(error);

      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (rows.length === 1) {
      const id_user = rows[0].id_user;
      const token = jwt.sign({ id_user }, config.secret, { expiresIn: 1440 * 4 });
      const data = { id_user, token, ip_address: ip.address() };

      const insertQuery = "INSERT INTO akses_token SET ?";

      connection.query(insertQuery, data, function (insertError) {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ success: false, message: "Internal server error" });
        }

        res.json({
          success: true,
          message: "Token JWT Generated!",
          token: token,
          currUser: id_user
        });
      });
    } else {
      return res.json({ status: 403, message: "Invalid Email or password" });
    }
  });
};

exports.register = async (req, res) => {
  const { fullname, email, phone, password, confirmation_password } = req.body

  if (!fullname || !email || !phone || !password || !confirmation_password) {
    return res.status(400).json({ status: 400, message: "Field can't blank" });
  } else {
    connection.query(`SELECT * FROM users WHERE email=?`, [email],
      function (error, rows, result) {
        if (error) {
          console.log(error);
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
          const uniqueEmail = rows.length
          if (uniqueEmail) {
            return res.status(401).json({ status: 401, message: `Email ${email} already exist` });
          } else {
            if (password != confirmation_password) {
              return res.status(402).json({ status: 402, message: "Confirmation password doesn't match" });
            } else {
              const qRegiter = `INSERT INTO users(fullname,email,phone,password) VALUES(?,?,?,?)`
              const vRegister = [fullname, email, phone, md5(password)]
              connection.query(qRegiter, vRegister,
                function (error, rows, result) {
                  if (error) {
                    console.log(error);
                    return res.status(500).json({ status: 500, message: "Internal Server Error" });
                  } else {
                    const qIndexId = `SELECT * FROM users WHERE email=?`
                    connection.query(qIndexId, [email],
                      function (error, rows, result) {
                        if (error) {
                          console.log(error);
                          return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                          const indexId = rows[0].id_user
                          const qCreateCart = `INSERT INTO carts (id_user) VALUES(?)`
                          connection.query(qCreateCart, [indexId],
                            function (error, rows, result) {
                              if (error) {
                                console.log(error);
                                return res.status(500).json({ status: 500, message: "Internal Server Error" });
                              } else {
                                return res.status(200).json({ status: 200, message: "Register Successfully" });
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
      }
    )
  }
}


exports.check_user = function (req, res) {
  const id_user = req.decoded.id_user
  res.status(200).json({ status: 200, id_user: id_user });
};


exports.profile = function (req, res) {
  const id_user = req.decoded.id_user
  connection.query(`SELECT * FROM users WHERE id_user=?`, id_user,
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(rows);
        response.ok(rows, res)
      }
    });
};

exports.editProfile = function (req, res) {
  const id_user = req.decoded.id_user;
  const { fullname, email, phone } = req.body

  if (!fullname || !email || !phone) {
    return res.status(400).json({ status: 400, message: "Field can't blank" });
  } else {
    connection.query(`SELECT email FROM users WHERE id_user=?`, id_user,
      function (error, r, result) {
        if (error) {
          console.log(error);
          return res.status(500).json({ status: 500, message: "Internal Server Error" });
        } else {
          const currentEmail = r[0].email
          if (email == currentEmail) {
            const qEditProfile = `UPDATE users SET fullname=?,phone=? WHERE id_user=?`
            const vEditProfile = [fullname, phone, id_user]
            connection.query(qEditProfile, vEditProfile,
              function (error, rows, result) {
                if (error) {
                  console.log(error);
                  return res.status(500).json({ status: 500, message: "Internal Server Error" });
                } else {
                  return res.status(200).json({ status: 200, message: `Update profile successfully email not changed` });
                }
              }
            )
          } else {
            connection.query(`SELECT * FROM users WHERE email=? AND NOT email=?`, [email, currentEmail],
              function (error, rows, result) {
                if (error) {
                  console.log(error);
                  return res.status(500).json({ status: 500, message: "Internal Server Error" });
                } else {
                  const uniqueEmail = rows.length
                  if (uniqueEmail) {
                    return res.status(401).json({ status: 401, message: `Email ${email} already exist` });
                  } else {
                    const qEditProfile = `UPDATE users SET fullname=?, email=?,phone=? WHERE id_user=?`
                    const vEditProfile = [fullname, email, phone, id_user]
                    connection.query(qEditProfile, vEditProfile,
                      function (error, rows, result) {
                        if (error) {
                          console.log(error);
                          return res.status(500).json({ status: 500, message: "Internal Server Error" });
                        } else {
                          return res.status(200).json({ status: 200, message: `Update profile successfully` });
                        }
                      }
                    )
                  }
                }
              }
            )
          }

        }
      }
    )
  }
};


//Post password Users match
exports.editPassword = function (req, res) {
  const old_password = req.body.old_password;
  const new_password = req.body.password;
  const id_user = req.decoded.id_user;
  connection.query(
    `SELECT password FROM users
                        WHERE id_user=?`,
    [id_user],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
      } else {
        const validation_password = rows[0].password
        if (md5(old_password) != validation_password) {
          return res.status(400).json({ status: 400, message: `Incorrect old password` });
        } else if (md5(old_password) == validation_password) {
          connection.query(
            `UPDATE users SET password=? WHERE id_user=?`,
            [md5(new_password), id_user],
            function (error, rows, fields) {
              if (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal Server Error" });
              } else {
                return res.status(200).json({ status: 200, message: "Change password successfully" });
              }
            }
          );
        }
      }
    }
  );
};
