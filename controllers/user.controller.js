const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

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
const registerUser = async(req, res) => {
    const { fullname, email, password } = req.body;

    if(!fullname || !email || !password) {
        return res.status(400).json({ error: 'All must be filled' })
    }

    // if(password !== confirmPassword) {
    //     return res.status(400).json({ error: 'Password not matched'})
    // }

    try {
        const duplicateUser = await prisma.user.findUnique({
            where: { email },
        })

        if(duplicateUser) {
            return res.status(400).json({ error: 'Email already registered'})
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
        const token = jwt.sign({ userId: newUser.id }, secretKey, {expiresIn: '1h' });
        res.json({ message: 'Registration Successful', user: newUser, token })

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Registration Failed' })
    }
}

// Login User
const loginUsers = async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: 'All must be filled' })
    }
    
    try {
        const checkUser = await prisma.user.findUnique({
            where: { email },
        });

        if(!checkUser) {
            return res.status(400).json({ error: 'Wrong email or password' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(passwordMatch) {
            // Token JWT Login
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

            res.json({ message: 'Login Successful', user, token })
        } else {
            return res.status(401).json({ error: 'Wrong email or password' })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Login Failed' })
    }
}

// jangan lupa export functionnya
module.exports = {
    contohResponse,
    registerUser,
    loginUsers,
}