const Product = require('../models/product');
const Category = require('../models/catagories');


let addProduct = (req, res) => {
    console.log("addProduct controller called!");
    const { name, price, description, images, genderType, category, stock } = req.body;

    Category.findById(category)
        .then(foundCategory => {
            if (!foundCategory) {
                return res.status(404).send({ message: "Category not found" });
            }
            
            const newProduct = new Product({
                name,
                price,
                description,
                images,
                genderType,
                category,
                stock
            });

            newProduct.save()
                .then(product => {
                    res.status(201).send({ message: "Product added successfully!", product });
                })
                .catch(err => {
                    res.status(400).send({ message: "Error occurred while adding the product", error: err });
                });
        })
        .catch(err => {
            res.status(404).send({ message: "Error finding the category", error: err });
        });
};


// Update an existing product
let updateProduct = (req, res) => {
    console.log("updateProduct controller called!");
    const { productId } = req.params;
    const { name, price, description, images, genderType, category, stock } = req.body;

    Product.findByIdAndUpdate(productId, {
        name,
        price,
        description,
        images,
        genderType,
        category,
        stock
    }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({ message: "Product not found" });
            }
            res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating the product", error: err });
        });
};

// Get all products
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

// Get a single product by ID
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
