const express = require('express');
const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/additional.route')
const advertRoute = require('./routes/advert.route')
const favoriteRoute = require('./routes/favorit.route')
const paketRoute = require('./routes/paket.route')
const transaksiRoute = require('./routes/transaksi.route')
const chatRoute = require('./routes/chat,route')
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

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

// route untuk user
app.use('/api/user', userRoute)
app.use('/api/additional', categoryRoute)
app.use('/api/advert', advertRoute)
app.use('/api/likeAdvert', favoriteRoute)
app.use('/api/paket', paketRoute)
app.use('/api/transaksi', transaksiRoute)
app.use('/api/chat', chatRoute)

// ini untuk untuk memastikan server berjalan di port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
