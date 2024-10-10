const { PrismaClient } = require('@prisma/client');
const { default: axios } = require('axios');

const prisma = new PrismaClient()

const generateOrderId = () => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

const postTransaksi = async (req, res) => {
    const { id_user, id_paket, price } = req.body;
    const midtransUrl = `https://app.sandbox.midtrans.com/snap/v1/transactions`;
    const base64ServerKey = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')

    try {
        const getOrderId = generateOrderId()

        const fetchToMidtrans = await axios.post(midtransUrl, {
            transaction_details: {
                order_id: getOrderId,
                gross_amount: price
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${base64ServerKey}`
            }
        })

        const postTransaksi = await prisma.riwayatPembelian.create({
            data: {
                userId: id_user,
                paketId: id_paket,
                order_id: getOrderId,
                payment_url: fetchToMidtrans.data.redirect_url
            }
        })

        return res.status(200).json({
            status: 'success',
            data: postTransaksi
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'error',
            message: error
        })
    }
}

const riwayatPembelian = async (req, res) => {
    const { id } = req.params;

    try {
        const riwayat = await prisma.riwayatPembelian.findMany({
            where: {
                userId: id
            },
            include: {
                paket: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json({
            status: 'success',
            data: riwayat
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'error',
            message: error
        })
    }
}

const midtransNotification = async (req, res) => {
    const { order_id, transaction_status } = req.body;

    const getDateForExpire = (day) => {
        let currentDate = new Date();
        
        let highlightExpiry = new Date();
        highlightExpiry.setDate(currentDate.getDate() + day);
        
        let formattedExpiry = highlightExpiry.toISOString()

        return formattedExpiry
    }

    try {
        const findTransaksi = await prisma.riwayatPembelian.findFirst({
            where: {
                order_id: order_id
            }
        })

        const updateStatusTransaksi = await prisma.riwayatPembelian.update({
            where: {
                id: findTransaksi?.id
            },
            data: {
                status: transaction_status === 'settlement' || transaction_status === 'capture' ? 'SUCCESS' : 'FAILED'
            }
        })

        if (transaction_status === 'settlement' || transaction_status === 'capture') {
            const findPaket = await prisma.paket.findUnique({
                where: {
                    id: findTransaksi.paketId
                }
            })

            const getCurrentUserKuota = await prisma.user.findUnique({
                where: {
                    id: findTransaksi.userId
                }
            })

            if (findPaket.type === "PREMIUM") {
                const updatePaket = await prisma.user.update({
                    where: {
                        id: findTransaksi.userId
                    },
                    data: {
                        isPremium: true,
                        premiumExpiry: getDateForExpire(findPaket.duration),
                        kuota_iklan: {
                            increment: 100
                        },
                        kuota_sorot: {
                            increment: 100
                        }
                    }
                })
            }

            if (findPaket.type === "IKLAN") {
                const updatePaket = await prisma.user.update({
                    where: {
                        id: findTransaksi.userId
                    },
                    data: {
                        kuota_iklan: getCurrentUserKuota.kuota_iklan + findPaket.kuota,
                    }
                })
            } else {
                const updatePaket = await prisma.user.update({
                    where: {
                        id: findTransaksi.userId
                    },
                    data: {
                        kuota_sorot: getCurrentUserKuota.kuota_sorot + findPaket.kuota,
                    }
                })
            }
        }

        res.status(200).json({
            status: 'success',
            data: updateStatusTransaksi
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
    postTransaksi,
    riwayatPembelian,
    midtransNotification
}