const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

// Advert Produk
const createAdvert = async (req, res) => {
    let { title, description, price, image, categoryId, provinceId, userId } = req.body
    price = parseInt(price)

    try {
        const advert = await prisma.advert.create({
            data: {
                title,
                description,
                price,
                image,
                categoryId,
                provinceId,
                userId
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
    const { page, pageSize, id } = req.query;

    try {
        if (id) {
            // Retrieve a specific advert by ID
            showAdvert = await prisma.advert.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

        } else {
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
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed show advert' })
    }
}

// Detail Advert
const getDetailAdvert = async (req, res) => {
    const { id } = req.params;

    try {
        const detailAdvert = await prisma.advert.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
                province: true,
                user: true,
                category: true,
            },
        });

        // Check data detail advert
        if (!detailAdvert) {
            return res.status(404).json({ error: 'Advert not found!' });
        }

        res.json({ detailAdvert });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get Like Advert
const getLikeAdvert = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },

            include: {
                likedAdverts: {
                    include: {
                        advert: {
                            include: {
                                province: true,
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({
            user,
            message: 'Like advert success'
        });

    } catch (error) {
        res.status(400).json({ error: 'Failed like advert' });
    }
}

// Create Like Advert
const createLikeAdvert = async (req, res) => {
    const { userId, advertId } = req.body;

    try {
        const response = await prisma.like.create({
            data: {
                userId,
                advertId
            }
        });

        res.status(200).json({
            response,
            message: 'Create like success'
        });

    } catch (error) {
        res.status(400).json({ error: 'Failed create like advert' });
    }
}

// Delete Like Advert
const deleteLikeAdvert = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await prisma.like.delete({
            where: {
                id,
            }
        });

        res.status(200).json({
            response,
            message: 'Delete like advert success'
        });

    } catch (error) {
        res.status(400).json({ error: 'Failed delete like advert' });
    }
}

module.exports = {
    createAdvert,
    getAdvert,
    getDetailAdvert,
    getLikeAdvert,
    createLikeAdvert,
    deleteLikeAdvert
}