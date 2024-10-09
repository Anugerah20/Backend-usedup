const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const createRoomChat = async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const existingRoom = await prisma.room.findFirst({
            where: {
                users: {
                    some: {
                        id: {
                            in: [friendId]
                        }
                    }
                }
            }
        })

        if (existingRoom) {
            const updateRoom = await prisma.room.update({
                where: {
                    id: existingRoom.id
                },
                data: {
                    createdAt: new Date()
                }
            })

            return res.status(200).json({
                message: 'success update room'
            })
        }

        const createRoom = await prisma.room.create({
            data: {
                users: { connect: [{ id: userId }, { id: friendId }] }
            }
        })

        res.status(200).json({
            message: 'success create room'
        });
    } catch (error) {
        console.log('failed create room', error);
        res.status(500).json({ error: 'Failed create room' });
    }
}

const getRoomChat = async (req, res) => {
    const { userId } = req.body;
    try {
        const rooms = await prisma.room.findMany({
            where: {
                users: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const filteredRooms = rooms.map(room => {
            const filteredUsers = room.users.filter(user => user.id !== userId);
            return { ...room, users: filteredUsers };
        });

        res.status(200).json({
            rooms: filteredRooms,
            message: 'success get room'
        });
    } catch (error) {
        console.log('failed get room', error);
        res.status(500).json({ error: 'Failed get room' });
    }
}

const getChat = async (req, res) => {
    const { data } = req.body;

    try {
        const roomMessages = await prisma.room.findFirst({
            where: {
                id: data.room.id
            },
            include: {
                messages: {
                    include: {
                        sender: true
                    }
                },
                users: {
                    where: {
                        id: {
                            not: data.userid
                        }
                    }
                }
            }
        });

        res.status(200).json({
            roomMessages,
            message: 'success get users'
        });
    } catch (error) {
        console.log('failed get messages', error);
        res.status(500).json({
            error: 'failed get messages'
        });
    }
}

const sendChatMessage = async (req, res) => {
    const { data } = req.body;

    try {
        const sendMessage = await prisma.message.create({
            data: {
                content: data.content,
                senderId: data.senderId,
                roomId: data.roomId
            }
        });

        const updateCreated = await prisma.room.update({
            where: {
                id: data.roomId
            },
            data: {
                createdAt: new Date()
            }
        })

        res.status(200).json({
            sendMessage,
            message: 'success create message'
        });
    } catch (error) {
        console.error('failed create message', error);
        res.status(500).json({
            error: 'failed create message'
        })
    }

}

module.exports = { getRoomChat, getChat, sendChatMessage, createRoomChat }