const express = require('express');
const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/category.route')
const advertRoute = require('./routes/advert.route')
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
app.use('/api/category', categoryRoute)
app.use('/api/advert', advertRoute)

// ini untuk untuk memastikan server berjalan di port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
