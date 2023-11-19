const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const main = async () => {
     await prisma.category.createMany({
          data: [
               {
                    "name": 'Mobil Bekas',
               },
               {
                    "name": 'Motor Bekas',
               },
               {
                    "name": 'Property',
               },
               {
                    "name": 'Elektronik dan Gadget',
               },
               {
                    "name": 'Hobi dan Olahraga',
               }
          ]
     })
}

main()
     .then(async () => {
          await prisma.$disconnect()
     })
     .catch(async (e) => {
          await prisma.$disconnect()
          process.exit(1)
     })
