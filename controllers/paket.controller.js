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

const createPaketSorot = async (req, res) => {
    const { id, userId } = req.body;

    let currentDate = new Date();

    let highlightExpiry = new Date();
    highlightExpiry.setDate(currentDate.getDate() + 30);

    let formattedExpiry = highlightExpiry.toISOString()

    try {
        const createPaket = await prisma.advert.update({
            where: {
                id
            },
            data: {
                isHighlighted: true,
                highlightExpiry: formattedExpiry
            }
        })

        const updateKuotaUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                kuota_sorot: {
                    decrement: 1
                }
            }
        })

        return res.status(200).json({
            status: 'success',
            data: JSON.parse(JSON.stringify(createPaket, bigIntReplacer))
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
    getPaket,
    createPaketSorot
}