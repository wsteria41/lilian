const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const authRoutes = require('./routes/authRoutes')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({message: 'Lilian backend API running.'})
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

//test db
pool.query('SELECT NOW()', (err, res)=> {
    if(err){
        console.log('Connection lost',err)
    }else{
        console.log('Connected to db', res.rows[0])
    }
})

module.exports = app