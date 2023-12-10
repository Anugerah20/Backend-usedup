const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()


const getAllCategory = async (req, res) => {

    try {
        const response = await prisma.category.findMany({});

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

    try {
        const category = await prisma.category.create({
            data: {
                name,
            }
        })
        res.status(200).json({ category, message: 'Succesful create category' })
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed create category' })
    }
}

module.exports = {
    getAllCategory,
    createCategory
}