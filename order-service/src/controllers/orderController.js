const supabase = require("../config/supabaseClient");
const axios = require("axios");

// POST /orders  (single product order - optional)
exports.createOrder = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        if (!product_id || quantity == null) {
            return res.status(400).json({ error: "product_id and quantity required" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: "quantity must be > 0" });
        }

        // 1) Fetch product
        const productRes = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/products/${product_id}`
        );

        const product = productRes.data;

        // 2) Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock available" });
        }

        const total_price = product.price * quantity;

        // 3) Create order
        const { data: order, error } = await supabase
            .from("orders")
            .insert([{ user_id, product_id, quantity, total_price }])
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });

        // 4) Decrease stock
        await axios.patch(
            `${process.env.PRODUCT_SERVICE_URL}/products/${product_id}/decrease-stock`,
            { quantity }
        );

        res.status(201).json({
            message: "Order placed successfully ✅",
            order
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /orders
exports.getAllOrders = async (req, res) => {
    try {
        const { data, error } = await supabase.from("orders").select("*");

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /orders/from-cart  (MAIN FEATURE)
exports.createOrderFromCart = async (req, res) => {
    try {
        // const { user_id } = req.body;
        const user_id = req.user.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "user_id is required" });
        }

        // 1) Get cart items
        // const cartRes = await axios.get(
        //     `${process.env.CART_SERVICE_URL}/cart/${user_id}`
        // );
        const cartRes = await axios.get(`${process.env.CART_SERVICE_URL}/cart`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });


        const cartItems = cartRes.data;

        if (!cartItems.length) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const placedOrders = [];

        // 2) Place order for each cart item
        for (const item of cartItems) {
            // Fetch product
            const productRes = await axios.get(
                `${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}`
            );

            const product = productRes.data;

            // Validate stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for product: ${product.name}`
                });
            }

            const total_price = product.price * item.quantity;

            // Create order
            const { data: order, error } = await supabase
                .from("orders")
                .insert([
                    {
                        user_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        total_price
                    }
                ])
                .select()
                .single();

            if (error) return res.status(500).json({ error: error.message });

            // Decrease stock
            await axios.patch(
                `${process.env.PRODUCT_SERVICE_URL}/products/${item.product_id}/decrease-stock`,
                { quantity: item.quantity }
            );

            // Remove ONLY this product from cart
            await axios.delete(`${process.env.CART_SERVICE_URL}/cart/remove-item`, {
                headers: {
                    Authorization: req.headers.authorization
                },
                data: {
                    product_id: item.product_id
                }
            });

            placedOrders.push(order);
        }

        res.status(201).json({
            message: "Order placed from cart ✅",
            orders: placedOrders
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
