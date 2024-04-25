const mongoose = require('mongoose');

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
    images: [String],
    genderType: {
        type: String,
        required: true,
        enum: ['Men', 'Women']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
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
