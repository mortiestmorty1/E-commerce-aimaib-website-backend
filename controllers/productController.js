const Product = require('../models/product');
const multer = require('multer');
const { cloudinary } = require('../config/cloudinaryConfig');
const upload = multer({ storage: multer.memoryStorage() });

const uploadImageToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'E-commerce' 
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result.url); 
        }).end(buffer);
    });
};

let addProduct = (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).json({ message: "File upload error", error: err.message });
        }

        try {
            const imageUrl = req.file ? await uploadImageToCloudinary(req.file.buffer) : null;
            if (!imageUrl) return res.status(400).send({ message: "Image upload failed" });

            const { name, price, description, genderType, category, sizes, stock } = req.body;
            const sizesArray = JSON.parse(sizes);
            const newProduct = new Product({
                name,
                price,
                description,
                images: [imageUrl],
                genderType,
                category,
                sizes: sizesArray,
                stock
            });

            const product = await newProduct.save();
            res.status(201).send({ message: "Product added successfully!", product });
        } catch (error) {
            res.status(500).send({ message: "Error occurred while adding the product", error: error.message });
        }
    });
};

let updateProduct = (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError || err) {
            return res.status(500).json({ message: "File upload error", error: err.message });
        }

        const { name, price, description, genderType, category, sizes, stock } = req.body;
        const sizesArray = JSON.parse(sizes);
        let updateObject = {
            name,
            price,
            description,
            genderType,
            category,
            sizes: sizesArray,
            stock
        };
        try {
            if (req.file) {
                const imageUrl = await uploadImageToCloudinary(req.file.buffer);
                updateObject.images = [imageUrl];
            }

            const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateObject, { new: true });
            if (!updatedProduct) return res.status(404).send({ message: "Product not found" });

            res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
        } catch (error) {
            res.status(500).send({ message: "Error updating the product", error: error.message });
        }
        console.log("Product ID:", req.params.productId);
console.log("Update Object:", updateObject);

    });
};


let getAllProducts = (req, res) => {
    console.log("getAllProducts controller called!");
    Product.find({})
        .then(products => {
            res.status(200).send({ products });
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving products", error: err });
        });
};


let getProductById = (req, res) => {
    console.log("getProductById controller called!");
    const { productId } = req.params;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.status(200).send({ product });
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving product", error: err });
        });
};
let deleteProduct = (req, res) => {
    console.log("deleteProduct controller called!");
    const { productId } = req.params;
    findByIdAndDelete(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.status(200).send({ message: "Product deleted successfully", product });
        })
        .catch(err => {
            res.status(500).send({ message: "Error deleting the product", error: err });
        });
}

module.exports = {
    addProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    deleteProduct
};
