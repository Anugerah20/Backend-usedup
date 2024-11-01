const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/additional.route')
const advertRoute = require('./routes/advert.route')
const favoriteRoute = require('./routes/favorit.route')
const paketRoute = require('./routes/paket.route')
const transaksiRoute = require('./routes/transaksi.route')
const chatRoute = require('./routes/chat,route')
const cors = require('cors')
const { CronJob } = require('cron');
const { checkPremiumExpired } = require('./controllers/user.controller');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const port = process.env.PORT || 3000;

const job = new CronJob(`*/10 * * * *`, function () {
    checkPremiumExpired()
});

job.start();

// ini untuk parse request body
app.use(express.json());
// ini untuk parse request dari form-data
app.use(express.urlencoded({ extended: true }));
// ini untuk mengizinkan CORS
app.use(cors())

// welcome message
app.get('/', (req, res) => {
    res.json({
        message: "Selamat datang di usedup API!"
    })
})

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('sendMessage', (data) => {
        console.log('message received', data);
        io.emit('newMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected',);
    });
});

// route untuk user
app.use('/api/user', userRoute)
app.use('/api/additional', categoryRoute)
app.use('/api/advert', advertRoute)
app.use('/api/likeAdvert', favoriteRoute)
app.use('/api/paket', paketRoute)
app.use('/api/transaksi', transaksiRoute)
app.use('/api/chat', chatRoute)

// ini untuk untuk memastikan server berjalan di port 3000
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
