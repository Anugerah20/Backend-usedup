const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// contoh response 
const contohResponse = (req, res) => {

    // logic disini

    res.json({
        message: "Ini contoh response"
    })
}

// kalo bikin function baru, misal function baru untuk register user, bikin function baru disini
// function registerUser(req, res) {
// logic disini
// }

// jangan lupa export functionnya
module.exports = {
    contohResponse
}