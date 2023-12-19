const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

// Advert Produk
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

// Show Advert
const getAdvert = async (req, res) => {
    const { page, pageSize } = req.query;

    try {
        const showAdvert = await prisma.advert.findMany({
            skip: (page - 1) * pageSize,
            take: parseInt(pageSize),
        })

        // Count total items in the database
        const totalItems = await prisma.advert.count();

        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            showAdvert,
            totalPages
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed show advert' })
    }
}

module.exports = {
    createAdvert,
    getAdvert
}