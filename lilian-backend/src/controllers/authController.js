const authService = require('../services/authService');

async function register(req, res) {
    try{
        const{name, email, password} = req.body;
        const result = await authService.register(name, email, password);
        res.json(result);        
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

async function login(req, res) {
    try{
        const{email, password} = req.body;
        if(!email || !password){
            throw new Error("Email or password missing");
        }
        const result = await authService.login(email, password);
        res.json(result);        
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

module.exports = {register, login};