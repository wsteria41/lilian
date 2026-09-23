const pool = require('../config/db')
const cloudinary = require('../config/cloudinary')

async function getAll(category) {
    let query = 'SELECT * FROM products'
    let params = []

    if (category) {
        query += ' WHERE category = $1'
        params.push(category)
    }

    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    return result.rows
}

async function getById(id) {
    const product = await pool.query(
        'SELECT * FROM products WHERE id = $1', [id]
    )
    if (product.rows.length === 0) {
        throw new Error('Product not found')
    }

    const variants = await pool.query(
        'SELECT * FROM product_variants WHERE product_id = $1', [id]
    )
    const images = await pool.query(
        'SELECT * FROM product_images WHERE product_id = $1', [id]
    )

    return {
        ...product.rows[0],
        variants: variants.rows,
        images: images.rows
    }
}

async function create(name, description, price, category) {
    const result = await pool.query(
        'INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, category]
    )
    return result.rows[0]
}

async function update(id, data) {
    const { name, description, price, category } = data
    const result = await pool.query(
        'UPDATE products SET name=$1, description=$2, price=$3, category=$4 WHERE id=$5 RETURNING *',
        [name, description, price, category, id]
    )
    return result.rows[0]
}

async function deleteProduct(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id])
    return { message: 'Product deleted' }
}


async function addVariant(productId, size, color, stock) {
    const result = await pool.query(
        'INSERT INTO product_variants (product_id, size, color, stock) VALUES ($1, $2, $3, $4) RETURNING *',
        [productId, size, color, stock]
    )
    return result.rows[0]
}

async function getVariants(productId) {
    const result = await pool.query(
        'SELECT * FROM product_variants WHERE product_id = $1',
        [productId]
    )
    return result.rows
}

async function uploadImage(productId, file){
    const result = await new Promise((resolve, reject) =>{
        cloudinary.uploader.upload_stream(
            {folder: 'lilian'},
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }   
        ).end(file.buffer)
    })
    const image= await pool.query(
        'INSERT INTO product_images(product_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
        [productId, result.secure_url, false]
    )
    return image.rows[0]
}

module.exports = { getAll, getById, create, update, deleteProduct, addVariant, getVariants, uploadImage }