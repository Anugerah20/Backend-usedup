const { PrismaClient } = require('@prisma/client');
const { default: slugify } = require('slugify');

const prisma = new PrismaClient()


const getAllCategory = async (req, res) => {

    try {
        const response = await prisma.category.findMany({
            take: 6
        });

        res.json({
            message: 'Get All Category',
            data: response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Get All Category Failed' })
    }
}

// Kategori Produk
const createCategory = async (req, res) => {
    const { name } = req.body;

    const slugged = slugify(name, {
        lower: true,
        strict: true
    })

    try {
        const category = await prisma.category.create({
            data: {
                name,
                slug: slugged
            }
        })
        res.status(200).json({ category, message: 'Succesful create category' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed create category' })
    }
}

const getAllProvinces = async (req, res) => {
    try {
        const province = await prisma.province.findMany()

        res.status(200).json({
            status: 'success',
            data: province,
        })
    } catch (error) {
        
    }
}

module.exports = {
    getAllCategory,
    createCategory,
    getAllProvinces
}