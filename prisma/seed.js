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

     await prisma.province.createMany({
          data: [
               { "name": "Aceh" },
               { "name": "Bali" },
               { "name": "Banten" },
               { "name": "Bengkulu" },
               { "name": "DKI Yogyakarta" },
               { "name": "DKI Jakarta" },
               { "name": "Gorontalo" },
               { "name": "Jambi" },
               { "name": "Jawa Barat" },
               { "name": "Jawa Tengah" },
               { "name": "Jawa Timur" },
               { "name": "Kalimantan Barat" },
               { "name": "Kalimantan Selatan" },
               { "name": "Kalimantan Tengah" },
               { "name": "Kalimantan Timur" },
               { "name": "Kalimantan Utara" },
               { "name": "Kepulauan Bangka Belitung" },
               { "name": "Kepulauan Riau" },
               { "name": "Lampung" },
               { "name": "Maluku" },
               { "name": "Maluku Utara" },
               { "name": "Nusa Tenggara Barat" },
               { "name": "Nusa Tenggara Timur" },
               { "name": "Papua" },
               { "name": "Papua Barat" },
               { "name": "Riau" },
               { "name": "Sulawesi Barat" },
               { "name": "Sulawesi Selatan" },
               { "name": "Sulawesi Tengah" },
               { "name": "Sulawesi Tenggara" },
               { "name": "Sulawesi Utara" },
               { "name": "Sumatera Barat" },
               { "name": "Sumatera Selatan" },
               { "name": "Sumatera Utara" }
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
