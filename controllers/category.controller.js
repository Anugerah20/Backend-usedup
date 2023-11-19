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

module.exports = {
    getAllCategory
}