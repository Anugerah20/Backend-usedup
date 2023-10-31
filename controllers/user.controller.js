const { PrismaClient } = require('@prisma/client');
const { default: axios } = require('axios');

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

    // if(password !== confirmPassword) {
    //     return res.status(400).json({ error: 'Password not matched'})
    // }

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
        const token = jwt.sign({ userId: newUser.id }, secretKey, { expiresIn: '1h' });
        res.json({ message: 'Registration Successful', user: newUser, token })

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Registration Failed' })
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
            return res.status(400).json({ error: 'Wrong email or password' })
        }

        const passwordMatch = await bcrypt.compare(password, checkUser.password)

        if (passwordMatch) {
            // Token JWT Login
            const token = jwt.sign({ userId: checkUser.id }, secretKey, { expiresIn: '1h' });

            res.json({ message: 'Login Successful', checkUser, token })
        } else {
            return res.status(401).json({ error: 'Wrong email or password' })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Login Failed' })
    }
}
// Send Email Forgot Password
const sendEmailForgotPassword = async (nama, token, email) => {
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

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body

    // logic disini
    const checkUser = await prisma.user.findUnique({
        where: { email },
    });

    if (checkUser) {

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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

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
const updatePassword = async(req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if(!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password)

        if(!passwordMatch) {
            return res.status(401).json({ error: 'Current password is incorrect'})
        }

        const saltRounds = 10
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
            },
        })

        res.json({ message: 'Password Updated Successful'})
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Password Updated Failed' })
    }
}

// jangan lupa export functionnya
module.exports = {
    contohResponse,
    registerUser,
    loginUsers,
    forgotPassword,
    checkToken,
    updatePassword
}