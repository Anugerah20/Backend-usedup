const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

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

        res.json({ message: 'Registration Successful', user: newUser })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Registration Failed' })
    }
}

// jangan lupa export functionnya
module.exports = {
    contohResponse,
    registerUser,
}