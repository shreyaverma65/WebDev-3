
import Product from "../models/Product.js";

// Create a new product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        } = req.body;

        // Check required fields
        if (
            !name ||
            !sku ||
            !category ||
            price === undefined ||
            quantity === undefined ||
            !supplier
        ) {
            return res.status(400).json({
                message: "Please provide all required fields",
                success: false
            });
        }

        // Create product in MongoDB
        const product = await Product.create({
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        });

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "SKU already exists",
                success: false
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid product ID",
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

