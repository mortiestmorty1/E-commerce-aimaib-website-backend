const mongoose = require('mongoose');
const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sizes: [String],
    sizeChart: String
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Clothing', 'Accessories']
    },
    subcategories: [subcategorySchema] 
});

const Category = mongoose.model('Category', categorySchema);
