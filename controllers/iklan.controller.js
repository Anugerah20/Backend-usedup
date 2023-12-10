const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

// Iklan Produk
const createAdvert = async (req, res) => {
    let { title, description, price, image, categoryId } = req.body
    price = parseInt(price)

    try {
        const advert = await prisma.advert.create({
            data: {
                title,
                description,
                price,
                image,
                categoryId

            },
        })
        res.status(201).json({ advert, message: 'Succesful create advert' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed create advert' })
    }
}

module.exports = {
    createAdvert
}