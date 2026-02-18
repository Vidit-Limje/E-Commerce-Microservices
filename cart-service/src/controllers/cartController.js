const supabase = require("../config/supabaseClient");
const axios = require("axios");

// POST /cart/add
exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!user_id || !product_id || quantity == null) {
            return res.status(400).json({
                error: "user_id, product_id, quantity are required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: "quantity must be > 0" });
        }

        // Validate product exists using Product Service
        const productRes = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/products/${product_id}`
        );

        const product = productRes.data;

        // Optional: check stock before adding
        if (product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock available" });
        }

        // Check if already exists
        const { data: existingItem, error: existingError } = await supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", user_id)
            .eq("product_id", product_id)
            .maybeSingle();

        if (existingError) {
            return res.status(500).json({ error: existingError.message });
        }

        // If exists -> update quantity
        if (existingItem) {
            const newQty = existingItem.quantity + quantity;

            const { data: updated, error: updateError } = await supabase
                .from("cart_items")
                .update({ quantity: newQty })
                .eq("id", existingItem.id)
                .select()
                .single();

            if (updateError) return res.status(500).json({ error: updateError.message });

            return res.json({
                message: "Cart updated ✅",
                cartItem: updated
            });
        }

        // Else insert new
        const { data, error } = await supabase
            .from("cart_items")
            .insert([{ user_id, product_id, quantity }])
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json({
            message: "Added to cart ✅",
            cartItem: data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /cart/:user_id
exports.getCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { data, error } = await supabase
            .from("cart_items")
            .select("*")
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /cart/remove-item
exports.removeCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ error: "user_id and product_id required" });
        }

        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user_id)
            .eq("product_id", product_id);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ message: "Cart item removed ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /cart/clear/:user_id
exports.clearCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });

        res.json({ message: "Cart cleared ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
