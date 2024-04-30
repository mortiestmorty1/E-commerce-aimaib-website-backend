const Product = require('../models/product');
const multer = require('multer');
const { cloudinary } = require('../config/cloudinaryConfig');
const upload = multer({ storage: multer.memoryStorage() }).array('images', 10);

const uploadImagesToCloudinary = (files) => {
    return Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: 'e-commerce',
                resource_type: 'auto'
            }, (error, result) => {
                if (error) reject(error);
                else resolve({ url: result.url, public_id: result.public_id });
            }).end(file.buffer);
        });
    }));
};

const deleteImageFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

let addProduct = (req, res) => {
    upload(req, res, async function (err) {
        if (err) return res.status(500).send({ message: "Error uploading files", error: err.message });

        try {
            const imageUploadResults = await uploadImagesToCloudinary(req.files);
            let sizesArray = [];
            try {
                sizesArray = JSON.parse(req.body.sizes);
            } catch (error) {
                return res.status(400).send({ message: "Invalid sizes format", error: error.toString() });
            }
            const newProduct = new Product({
                ...req.body, 
                images: imageUploadResults,
                sizes: sizesArray,
            });
            await newProduct.save();
            res.status(201).send({ message: "Product added successfully!", product: newProduct });
        } catch (error) {
            res.status(500).send({ message: "Error occurred while adding the product", error: error.message });
        }
    });
};

let updateProduct = (req, res) => {
    upload(req, res, async function (err) {
        if (err) return res.status(500).send({ message: "File upload error", error: err.message });

        let sizesArray = [];
        try {
            sizesArray = JSON.parse(req.body.sizes);
        } catch (error) {
            return res.status(400).send({ message: "Invalid sizes format", error: error.toString() });
        }

        const updateObject = {
            ...req.body,
            sizes: sizesArray,
        };

        try {
            const product = await Product.findById(req.params.productId);
            if (!product) return res.status(404).send({ message: "Product not found" });
            console.log("Existing image public IDs:", product.images.map(img => img.public_id));
            if (req.files && req.files.length > 0) {
                if (product.images && product.images.length > 0) {
                    await Promise.all(product.images.map(image => deleteImageFromCloudinary(image.public_id)));
                }
                const imageUploadResults = await uploadImagesToCloudinary(req.files);
                updateObject.images = imageUploadResults;
            } else {
                updateObject.images = product.images;
            }

            const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateObject, { new: true });
            res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
        } catch (error) {
            res.status(500).send({ message: "Error updating the product", error: error.message });
        }
    });
};

let getAllProducts = (req, res) => {
    Product.find({})
        .then(products => res.status(200).send({ products }))
        .catch(err => res.status(500).send({ message: "Error retrieving products", error: err }));
};

let getProductById = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) return res.status(404).send({ message: "Product not found" });
            res.status(200).send({ product });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving product", error: err }));
};

let deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).send({ message: "Product not found" });

        if (product.images.length > 0) {
            await Promise.all(product.images.map(image => deleteImageFromCloudinary(image.public_id)));
        }

        await Product.deleteOne({ _id: req.params.productId });
        res.status(200).send({ message: "Product and associated images deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting the product", error: error.message });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    deleteProduct
};
