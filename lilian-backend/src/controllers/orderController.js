const orderService = require('../services/orderService');

async function create(req, res){
    try{
        const {items, delivery_address} = req.body;
        const result = await orderService.create(req.user.id, items, delivery_address);
        res.json(result);
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

async function getMyOrders(res, req){
    try{
        const result = await orderService.getMyOrders(req.user.id);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

async function getById(req, res){
    try{
        const result = await orderService.getById(req.params.id);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

async function getAll(res, req){
    try{
        const result = await orderService.getAll();
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

async function updateStatus(req, res){
    try{
        const {status} = req.body;
        const result = await orderService.updateStatus(req.params.id, status);
        res.json(result);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports= {create, getMyOrders, getById, getAll, updateStatus};