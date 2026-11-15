const pool = require("../config/db");

async function create(
  userId,
  items,
  deliveryAddress,
  phone,
  note,
  paymentMethod,
) {
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("Сагс хоосон байна");
  if (!/^\d{8}$/.test(phone || ""))
    throw new Error("Утасны дугаар 8 оронтой байх ёстой");
  const method = ["cod", "transfer"].includes(paymentMethod)
    ? paymentMethod
    : "cod";
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let totalPrice = 0;
    for (const item of items) {
      const variant = await client.query(
        "SELECT * FROM product_variants WHERE id = $1",
        [item.variant_id],
      );
      if (variant.rows.length === 0) throw new Error("Variant олдсонгүй");
      if (variant.rows[0].stock < item.quantity)
        throw new Error("Stock хүрэлцэхгүй байна");

      const product = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );
      totalPrice += product.rows[0].price * item.quantity;
    }

    const shippingFee = totalPrice > 200000 ? 0 : 10000;
    const order = await client.query(
      "INSERT INTO orders (user_id, total_price, payment_method, shipping_fee) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, totalPrice + shippingFee, method, shippingFee],
    );
    const orderId = order.rows[0].id;

    for (const item of items) {
      const product = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );
      await client.query(
        "INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES ($1, $2, $3, $4, $5)",
        [
          orderId,
          item.product_id,
          item.variant_id,
          item.quantity,
          product.rows[0].price,
        ],
      );

      await client.query(
        "UPDATE product_variants SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.variant_id],
      );
    }
    await client.query(
      "INSERT INTO deliveries (order_id, address, phone, note) VALUES ($1, $2, $3, $4)",
      [orderId, deliveryAddress, phone, note || null],
    );

    await client.query("COMMIT");
    return { message: "Order created successfully", order: order.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getMyOrders(userId) {
  const result = await pool.query(
    "SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",
    [userId],
  );
  return result.rows;
}

async function getById(id) {
  const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
  const items = await pool.query(
    "SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1",
    [id],
  );
  const delivery = await pool.query(
    "SELECT * FROM deliveries WHERE order_id = $1",
    [id],
  );

  return { ...order.rows[0], items: items.rows, delivery: delivery.rows[0] };
}

async function getAll() {
    const result = await pool.query(`
        SELECT o.*, u.name AS user_name, d.address, d.phone, d.note
        FROM orders o
        JOIN users u ON u.id = o.user_id
        LEFT JOIN deliveries d ON d.order_id = o.id
        ORDER BY o.created_at DESC`)
    return result.rows
}

async function updatePayment(id, paymentStatus) {
    if (!['unpaid', 'paid'].includes(paymentStatus)) throw new Error('Буруу төлөв')
    const result = await pool.query(
        'UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *',
        [paymentStatus, id]
    )
    return result.rows[0]
}

async function updateStatus(id, status) {
  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id],
  );
  return result.rows[0];
}

module.exports = { getAll, getById, getMyOrders, updateStatus, updatePayment, create };
