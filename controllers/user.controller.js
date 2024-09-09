const { PrismaClient } = require('@prisma/client');
const { default: axios } = require('axios');

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const bigIntReplacer = require('../utils/bigIntSerialization');

// Google login
const userGoogle = async (req, res) => {
    const { fullname, email, foto } = req.body;

    try {
        // Check if user already exists
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (user) {
            // User exists, update their details
            const responseUpdate = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    fullname,
                    foto
                }
            });

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.status(201).json({
                status: 'Success login with Google',
                data: responseUpdate,
                token
            });

        } else {
            // User doesn't exist, create a new user
            const createUserGoogle = await prisma.user.create({
                data: {
                    fullname,
                    email,
                    password: null,
                    foto,
                    isGmailGoogle: true
                }
            });

            // Generate JWT token for the new user
            const token = jwt.sign({ userId: createUserGoogle.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            return res.status(210).json({
                data: createUserGoogle,
                token
            });
        }
    } catch (error) {
        console.error('Error google login:', error);
        return res.status(400).json({
            message: 'Error during Google login',
            error
        });
    }
};

// Get user login with google
const getUserGoogle = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await prisma.user.findUnique({
            where: {
                id
            }
        });

        res.status(201).json({
            status: 'Success get user google',
            response
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error get user google',
            error
        });
    }
}

// Update user login with google
const updateUserGoogle = async (req, res) => {
    const { id } = req.params;
    const { fullname, no_telp, bio } = req.body;

    try {
        const response = await prisma.user.update({
            where: {
                id
            },
            data: {
                fullname,
                no_telp,
                bio
            }
        });

        res.status(201).json({
            status: 'Success update user google',
            response
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error update user google',
            error
        });
    }
}

// JWT env
const secretKey = process.env.JWT_SECRET;

// contoh response
const contohResponse = (req, res) => {

    // logic disini

    res.json({
        message: "Ini contoh response"
    })
}

// Register New User
const registerUser = async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'All must be filled' })
    }

    try {
        const duplicateUser = await prisma.user.findUnique({
            where: { email },
        })

        if (duplicateUser) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
            }
        })

        // Token JWT Register
        const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: '1d' });
        res.json({ message: 'Registration Successful', user: newUser, token })

    } catch (error) {
        console.log('Error Registration :', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}

// Login User
const loginUsers = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All must be filled' })
    }

    try {
        const checkUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!checkUser) {
            return res.status(400).json({ error: 'Wrong email address' });
        }

        // Check if the user registered with google
        if (checkUser.isGmailGoogle) {
            return res.status(400).json({ message: 'Silakan gunakan login Google untuk akun ini' })
        }

        const passwordMatch = await bcrypt.compare(password, checkUser.password);

        if (passwordMatch) {
            // Token JWT Login
            const token = jwt.sign({ userId: checkUser.id }, secretKey, { expiresIn: '1d' });

            res.json({ message: 'Login Successful', checkUser, token });
        } else {
            return res.status(401).json({ error: 'Wrong password' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Send Email Forgot Password
const sendEmailForgotPassword = async (nama, token, email) => {
    let data = {
        service_id: process.env.EMAILJS_SERVICE_ID_FORGOT,
        template_id: process.env.EMAILJS_TEMPLATE_ID_FORGOT,
        user_id: process.env.EMAILJS_USER_ID_FORGOT,
        template_params: {
            'nama': nama,
            'token': token,
            'to_email': email
        },
        'accessToken': process.env.EMAILJS_ACCESS_TOKEN_FORGOT
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data)

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body

    // logic disini
    const checkUser = await prisma.user.findUnique({
        where: { email },
    });

    if (checkUser) {

        if (checkUser.isGmailGoogle === true) {
            return res.status(500).json({
                error: 'lu login pake gmail kocak'
            })
        }

        const resetPasswordToken = jwt.sign({ userId: checkUser.id }, secretKey, { expiresIn: '1h' });

        await prisma.user.update({
            where: { email },
            data: {
                token_reset_password: resetPasswordToken,
            },
        });
        // function send email
        // params1: nama user
        // params2: email user
        const response = await sendEmailForgotPassword(checkUser.fullname, resetPasswordToken, checkUser.email)

        if (response) {
            return res.json({ message: 'Email berhasil terkirim!' })
        } else {
            return res.status(400).json({ error: 'Email gagal terkirim!' })
        }
        // jika tidak ada, kirim response error / belum terdaftar
    } else if (!checkUser) {
        return res.status(400).json({ error: 'belum terdaftar' })
    }
}

const checkToken = async (req, res) => {
    const { token } = req.body

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check if user has token
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
        });

        if (!user.token_reset_password) {
            return res.json({
                message: 'Token invalid',
                status: false,
            })
        }

        if (user) {
            return res.json({
                message: 'Token valid!',
                status: true,
            })
        }
    } catch (error) {
        return res.json({
            message: 'Token invalid',
            status: false,
        })
    }
}

// Update Password
const updatePassword = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        const saltRounds = 10
        const hashedNewPassword = await bcrypt.hash(password, saltRounds)

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                token_reset_password: null,
            },
        })

        res.json({
            status: true,
            message: 'Password Updated Successful'
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Password Updated Failed' })
    }
}

// Menampilkan data user
const showDataUser = async (req, res) => {
    const { id } = req.params;
    const newUser = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            advert: {
                include: {
                    province: true
                }
            }
        }
    });
    if (newUser) {
        res.status(200).json({
            message: "Show Data User Success",
            id: newUser.id,
            email: newUser.email,
            fullname: newUser.fullname,
            no_telp: newUser.no_telp,
            bio: newUser.bio,
            isVerified: newUser.isVerified,
            advert: JSON.parse(JSON.stringify(newUser.advert, bigIntReplacer))
        });
    } else {
        res.status(400).json({
            error: "User not found",
        });
    }
}

const editProfile = async (req, res) => {
    const { id } = req.params;
    const { fullname, no_telp, bio } = req.body;

    try {
        const updateUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                fullname,
                no_telp,
                bio,
            },
        });

        res.status(200).json({
            message: "berhasil edit dan update profile",
            updateUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const sendEmailVerifAccount = async (nama, token, email) => {
    let data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
            'nama': nama,
            'token': token,
            'to_email': email
        },
        'accessToken': process.env.EMAILJS_ACCESS_TOKEN
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data)

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

const verifAccount = async (req, res) => {
    const { id } = req.body;

    try {
        const account = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!account) {
            return res.status(404).json({
                message: 'id user tidak ditemukan'
            })
        }

        const token = jwt.sign({ userId: account.id }, secretKey, { expiresIn: '1d' });

        const updateUser = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                token_verif: token
            }
        })

        const response = await sendEmailVerifAccount(account.fullname, `http://127.0.0.1:5173/verifikasi/${token}`, account.email)

        if (response) {
            return res.status(200).json({
                updateUser, response, message: 'input verif token berhasil dan email berhasil dikirim'
            })
        } else {
            return res.status(400).json({
                message: 'email gagal dikirim'
            })
        }

    } catch (error) {
        console.error('error updating user verif token', error);
        res.status(500).json({
            error: 'internal server error'
        })
    }
}

const confirmVerifAccout = async (req, res) => {
    const { token } = req.params

    try {

        const decodeToken = jwt.verify(token, secretKey)

        const updateVerified = await prisma.user.update({
            where: {
                id: decodeToken.userId
            },
            data: {
                isVerified: true,
                token_verif: null
            }
        })

        return res.status(200).json({
            status: "success",
            message: "Verifikasi Berhasil!"
        })
    } catch (error) {
        return res.json({
            message: "verifikasi gagal"
        })
    }

}

// jangan lupa export functionnya
module.exports = {
    contohResponse,
    registerUser,
    loginUsers,
    forgotPassword,
    checkToken,
    updatePassword,
    showDataUser,
    editProfile,
    verifAccount,
    confirmVerifAccout,
    userGoogle,
    getUserGoogle,
    updateUserGoogle
}