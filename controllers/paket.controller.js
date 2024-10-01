const { PrismaClient } = require('@prisma/client');
const bigIntReplacer = require('../utils/bigIntSerialization');

const prisma = new PrismaClient()

const getPaket = async (req, res) => {
    try {
        const getPaket = await prisma.paket.findMany({})

        return res.status(200).json({
            status: 'success',
            data: getPaket
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ 
            status: 'error',
            message: error 
        })
    }
}

module.exports = {
    getPaket
}