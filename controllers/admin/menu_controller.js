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

// Konfigurasi multer untuk menyimpan file di folder 'images/menu'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/menu/');
    },
    filename: function (req, file, cb) {
        // Mendapatkan ekstensi file
        const ext = file.originalname.split('.').pop();
        // Membuat string acak sepanjang 6 karakter
        const randomString = crypto.randomBytes(3).toString('hex');
        // Menggabungkan nama file asli dengan string acak dan ekstensi
        const newFilename = file.originalname.replace(`.${ext}`, `_${randomString}.${ext}`);
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage }).single('picture');




//ALL MENUS
exports.menus = function (req, res) {
    connection.query(`SELECT * FROM menus`,
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

//MENU ID
exports.menuId = function (req, res) {
    let id_menu = req.params.id_menu
    connection.query(`SELECT * FROM menus WHERE id_menu=?`, [id_menu],
        function (error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res);
            };
        }
    )
};

//MENU ADD
exports.menuAdd = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        }

        let menu_name = req.body.menu_name;
        let variant = req.body.variant;
        let information = req.body.information;
        let price = req.body.price;
        let picture = req.file ? req.file.filename : null;
        let status = 0;

        connection.query(`INSERT INTO menus(menu_name, variant, information, price, picture, status)
                        VALUES(?,?,?,?,?,?)`, [menu_name, variant, information, price, picture, status],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'An error occurred while adding menu.' });
                } else {
                    return res.status(200).json({ success: true, message: 'Menu added successfully.' });
                }
            }
        );
    });
};

//MENU EDIT
exports.menuEdit = function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Jika terjadi kesalahan dari multer
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to upload image.' });
        } else if (err) {
            // Jika terjadi kesalahan lain
            console.log(err);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
        }

        // Jika tidak terjadi kesalahan, lanjutkan dengan menyimpan data menu
        let menu_name = req.body.menu_name;
        let variant = req.body.variant;
        let information = req.body.information;
        let price = req.body.price;
        let id_menu = req.params.id_menu;

        let picture = req.file ? req.file.filename : null;

        if (!picture) {
            // Jika tidak ada gambar baru diunggah
            connection.query(`UPDATE menus SET menu_name=?, variant=?, information=?, price=? WHERE id_menu=?`,
                [menu_name, variant, information, price, id_menu],
                function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ success: false, message: 'An error occurred while editing menu.' });
                    } else {
                        return res.status(200).json({ success: true, message: 'Menu edited successfully.' });
                    }
                }
            );
        } else {
            // Jika ada gambar baru diunggah, hapus gambar sebelumnya (jika ada)
            connection.query(`SELECT picture FROM menus WHERE id_menu=?`, [id_menu], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'An error occurred while fetching previous picture.' });
                } else {
                    const previousPicture = rows[0].picture;
                    if (previousPicture) {
                        try {
                            // Hapus gambar sebelumnya dari direktori
                            fs.unlinkSync(`images/menu/${previousPicture}`);
                        } catch (err) {
                            // Tangani kesalahan jika file tidak ditemukan atau gagal dihapus
                            console.log('Failed to delete previous picture:', err);
                        }
                    }
                    // Update data menu dengan gambar baru
                    connection.query(`UPDATE menus SET menu_name=?, variant=?, information=?, price=?, picture=? WHERE id_menu=?`,
                        [menu_name, variant, information, price, picture, id_menu],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                                return res.status(500).json({ success: false, message: 'An error occurred while editing menu.' });
                            } else {
                                return res.status(200).json({ success: true, message: 'Menu edited successfully.' });
                            }
                        }
                    );
                }
            });
        }
    });
};




//MENU SET STOCK
exports.menuSetStock = function (req, res) {
    let status = req.body.status
    let id_menu = req.params.id_menu

    if (status == 0) {
        connection.query(`UPDATE menus SET status=0 WHERE id_menu=?`,
            [id_menu],
            function (error, rows, fields) {
                if (error) {
                    console.log(error)
                } else {
                    response.ok(rows, res);
                };
            }
        )
    } else if (status == 1) {
        connection.query(`UPDATE menus SET status=1 WHERE id_menu=?`,
            [id_menu],
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


//MENU DELETE
exports.menuDelete = function (req, res) {
    let id_menu = req.params.id_menu;
    // Query untuk mengambil nama file gambar menu sebelum menghapus record
    connection.query(`SELECT picture FROM menus WHERE id_menu=?`, [id_menu], function (error, rows, fields) {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching previous picture.' });
        } else {
            const previousPicture = rows[0].picture;
            // Jalankan query hapus data
            connection.query(`DELETE FROM menus WHERE id_menu=?`, [id_menu], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ success: false, message: 'An error occurred while deleting menu.' });
                } else {
                    // Jika penghapusan berhasil, cek apakah ada gambar yang terkait dengan menu yang dihapus
                    if (previousPicture) {
                        try {
                            // Hapus gambar sebelumnya dari direktori
                            fs.unlinkSync(`images/menu/${previousPicture}`);
                        } catch (err) {
                            // Tangani kesalahan jika file tidak ditemukan atau gagal dihapus
                            console.log('Failed to delete previous picture:', err);
                        }
                    }
                    // Kirim respons bahwa menu telah dihapus dengan sukses
                    return res.status(200).json({ success: true, message: 'Menu deleted successfully.' });
                }
            });
        }
    });
};
