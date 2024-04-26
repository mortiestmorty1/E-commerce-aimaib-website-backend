const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRouter');
const orderRouter = require('./routes/orderRouter');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(cors())

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);

mongoose.connect(process.env.URI)
    .then(() => {
    console.log("connected to database!");
    })
    .catch((err) => {
    console.log("Error connecting to database", err);
    });

    app.get('/', (req, res) => {
        res.send("welcome to E-commerce website aimaib");
    });
  
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})