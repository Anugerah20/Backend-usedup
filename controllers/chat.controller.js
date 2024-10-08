const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const createRoomChat = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        const createRoom = await prisma.room.create({
            data: {
                users: { connect: [{ id: userId }, { id: friendId }] }
            }
        })
        res.status(200).json({
            createRoom,
            message: 'success create room'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed create room' });
    }
}

const getRoomChat = async (req, res) => {
    const { userId } = req.body;
    try {
        const rooms = await prisma.room.findMany({
            include: {
                users: {
                    include: {
                        messages: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                }
            },
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
        console.log('failed', error);
        res.status(500).json({
            message: 'failed get users'
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

        res.status(200).json({
            sendMessage,
            message: 'success create message'
        });
    } catch (error) {
        console.error('failed create message', error);
        res.status(500).json({
            message: 'failed create message'
        })
    }

}

module.exports = { getRoomChat, getChat, sendChatMessage, createRoomChat }