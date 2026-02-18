const supabase = require("../config/supabaseClient");

exports.createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if (!name || price == null || stock == null) {
            return res.status(400).json({ error: "name, price, stock are required" });
        }

        const { data, error } = await supabase
            .from("products")
            .insert([{ name, price, stock }])
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { data, error } = await supabase.from("products").select("*");

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return res.status(404).json({ error: "Product not found" });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.decreaseStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: "quantity must be > 0" });
        }

        // 1) Get current product
        const { data: product, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // 2) Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock" });
        }

        // 3) Update stock
        const newStock = product.stock - quantity;

        const { data: updated, error: updateError } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }

        res.json({
            message: "Stock decreased successfully ✅",
            product: updated
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity == null || quantity <= 0) {
            return res.status(400).json({ error: "quantity must be > 0" });
        }

        // 1) Fetch product
        const { data: product, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // 2) Update stock
        const newStock = product.stock + quantity;

        const { data: updated, error: updateError } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }

        res.json({
            message: "Stock added successfully ✅",
            product: updated
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Optional: check product exists first
        const { data: existing, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (fetchError) {
            return res.status(500).json({ error: fetchError.message });
        }

        if (!existing) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete product
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: "Product deleted successfully ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
