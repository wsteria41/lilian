const productService = require('../services/productService')

async function getAll(req, res) {
    try {
        const { category } = req.query
        const result = await productService.getAll(category)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getById(req, res) {
    try {
        const result = await productService.getById(req.params.id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const { name, description, price, category } = req.body
        const result = await productService.create(name, description, price, category)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function update(req, res) {
    try {
        const result = await productService.update(req.params.id, req.body)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function deleteProduct(req, res) {
    try {
        const result = await productService.deleteProduct(req.params.id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



async function addVariant(req, res) {
    try {
        const { size, color, stock } = req.body
        const result = await productService.addVariant(req.params.id, size, color, stock)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getVariants(req, res) {
    try {
        const result = await productService.getVariants(req.params.id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function uploadImage(req, res) {
    try{
        const result = await productService.uploadImage(req.params.id, req.file);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}



module.exports = { getAll, getById, create, update, deleteProduct: deleteProduct, addVariant, getVariants, uploadImage }