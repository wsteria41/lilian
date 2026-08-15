const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function register(name, email, password){
    const exist =  await pool.query(
        'SELECT id FROM users WHERE email = $1', [email]
    )
    if(exist.rows.length>0){
        throw new Error('User already exists');
    }

    //pass hash
    const hashedPassword = await bcrypt.hash(password, 10);

    //user uusgeh
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
    );

    return{
        message: 'user registered succes', user: result.rows[0]   
    }
}


async function login(email, password){
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    )
    if (result.rows.length === 0) {
        throw new Error('Email or password is incorrect');
    }

    const user = result.rows[0]

    //pass required
     const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        throw new Error('Password is incorrect');
    }

    //token uusgeh
    const token = jwt.sign({id: user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});

    return{token, user: {id:user.id, name:user.name, email:user.email, role:user.role}}
}

module.exports = {register, login}