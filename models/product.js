const mongoose = require('mongoose');
const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    available: { type: Boolean, default: true }
});
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    images: [{
        url: String,
        public_id: String
    }],

    genderType: {
        type: String,
        required: true,
        enum: ['Men', 'Women']
    },
    category: {
        type: String,
        required: true,
        enum:[
            "Shirts",
            "T-Shirts",
            "Jeans",
            "Jackets",
            "Sweaters",
            "pants",
            "Shorts",
            "Hoodies",
            "hats",
            "caps",
            "belts",
            "bracelets",
            "wallets",
            "socks",
            "rings",
            "necklaces",
            "purses",
            "bags",
            "tops"
        ]
    },
    sizes: [sizeSchema],
    stock: {
        type: Number,
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;