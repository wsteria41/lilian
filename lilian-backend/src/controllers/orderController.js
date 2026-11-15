const orderService = require('../services/orderService')

async function create(req, res) {
    try {
        const { items, delivery_address, phone, note, payment_method } = req.body
        const result = await orderService.create(req.user.id, items, delivery_address, phone, note, payment_method)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getMyOrders(req, res) {
    try {
        const result = await orderService.getMyOrders(req.user.id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getById(req, res) {
    try {
        const result = await orderService.getById(req.params.id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function getAll(req, res) {
    try {
        const result = await orderService.getAll()
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function updateStatus(req, res) {
    try {
        const { status } = req.body
        const result = await orderService.updateStatus(req.params.id, status)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

async function updatePayment(req, res) {
    try {
        const result = await orderService.updatePayment(req.params.id, req.body.payment_status)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { create, getMyOrders, getById, getAll, updateStatus, updatePayment }