const { PrismaClient } = require('@prisma/client');
const bigIntReplacer = require('../utils/bigIntSerialization');

const prisma = new PrismaClient()

// Advert Produk
const createAdvert = async (req, res) => {
    let { title, description, price, image, location, latitude, longitude, categoryId, provinceId, userId } = req.body
    price = parseInt(price)

    try {
        const advert = await prisma.advert.create({
            data: {
                title,
                description,
                price,
                image,
                location,
                latitude,
                longitude,
                categoryId,
                provinceId,
                userId
            },
        })
        res.status(201).json({
            advert: JSON.parse(JSON.stringify(advert, bigIntReplacer)),
            message: 'Create advert success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed create advert' })
    }
}

// Show Advert
const getAdvert = async (req, res) => {
    const { search, page, pageSize, id } = req.query;

    let adverts

    try {
        if (search) {
            // Retrieve a specific advert by ID
            adverts = await prisma.advert.findMany({
                where: {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                include: {
                    likes: true,
                },
                skip: (page - 1) * pageSize,
                take: parseInt(pageSize)
            });

        } else {
            adverts = await prisma.advert.findMany({
                skip: (page - 1) * pageSize,
                take: parseInt(pageSize),
                include: {
                    likes: true,
                }
            })
        }

        // Count total items in the database
        const totalItems = await prisma.advert.count();

        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            adverts: JSON.parse(JSON.stringify(adverts, bigIntReplacer)),
            totalPages
        })
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
                likes: true
            },
        });

        // Check data detail advert
        if (!detailAdvert) {
            return res.status(404).json({ error: 'Advert not found!' });
        }

        res.json({
            detailAdvert: JSON.parse(JSON.stringify(detailAdvert, bigIntReplacer)),
        });
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
    const { id } = req.params

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

// Delete Advert By ID
const deleteAdvert = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await prisma.advert.delete({
            where: {
                id,
            }
        });

        res.status(200).json({
            response: JSON.parse(JSON.stringify(response, bigIntReplacer)),
            status: 'success',
            message: 'Delete advert success'
        });

    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error: 'Failed delete advert',
            message: error

        });
    }
}

const getAdvertByCategory = async (req, res) => {
    const { categoryId } = req.query;

    let adverts

    console.log(categoryId)

    try {
        adverts = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                adverts: {
                    include: {
                        likes: true,
                        user: true,
                        province: true,
                        category: true
                    }
                }
            }
        });

        res.json({
            status: 'success',
            message: 'Get advert by category success',
            data: JSON.parse(JSON.stringify(adverts, bigIntReplacer)),
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed show advert' })
    }
}

module.exports = {
    createAdvert,
    getAdvert,
    getDetailAdvert,
    getLikeAdvert,
    createLikeAdvert,
    deleteLikeAdvert,
    deleteAdvert,
    getAdvertByCategory
}