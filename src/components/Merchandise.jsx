import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ShoppingCart,
    Plus,
    Minus,
    Star,
    Filter,
    SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Merchandise = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        const savedProducts = localStorage.getItem("ghgambit_products");
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            const mockProducts = [
                {
                    id: 1,
                    name: "GH GAMBIT Home Jersey",
                    price: 89.99,
                    category: "jerseys",
                    image:
                        "https://images.unsplash.com/photo-1635865165118-917ed9e20936",
                    rating: 4.8,
                    stock: 25,
                    description: "Official home jersey with premium fabric",
                },
                {
                    id: 2,
                    name: "Team Basketball",
                    price: 34.99,
                    category: "equipment",
                    image:
                        "https://images.unsplash.com/photo-1605296867424-35fc25c9212a",
                    rating: 4.9,
                    stock: 15,
                    description: "Official game basketball",
                },
                {
                    id: 3,
                    name: "GH GAMBIT Cap",
                    price: 24.99,
                    category: "accessories",
                    image:
                        "https://images.unsplash.com/photo-1620207418302-439b387441b0",
                    rating: 4.7,
                    stock: 40,
                    description: "Adjustable snapback cap",
                },
                {
                    id: 4,
                    name: "Training Shorts",
                    price: 39.99,
                    category: "apparel",
                    image:
                        "https://images.unsplash.com/photo-1602810318383-e6e1219a3b6f",
                    rating: 4.6,
                    stock: 30,
                    description: "Moisture-wicking training shorts",
                },
                {
                    id: 5,
                    name: "Team Hoodie",
                    price: 69.99,
                    category: "apparel",
                    image:
                        "https://images.unsplash.com/photo-1618354691471-d9e9a8f20c05",
                    rating: 4.9,
                    stock: 20,
                    description: "Premium cotton blend hoodie",
                },
                {
                    id: 6,
                    name: "Water Bottle",
                    price: 19.99,
                    category: "accessories",
                    image:
                        "https://images.unsplash.com/photo-1617196039897-7f07cf14e584",
                    rating: 4.5,
                    stock: 50,
                    description: "Insulated stainless steel bottle",
                },
            ];
            setProducts(mockProducts);
            localStorage.setItem("ghgambit_products", JSON.stringify(mockProducts));
        }

        const savedCart = localStorage.getItem("ghgambit_cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("ghgambit_cart", JSON.stringify(cart));
    }, [cart]);

    const categories = [
        { id: "all", label: "All Products" },
        { id: "jerseys", label: "Jerseys" },
        { id: "apparel", label: "Apparel" },
        { id: "accessories", label: "Accessories" },
        { id: "equipment", label: "Equipment" },
    ];

    const filteredProducts = products
        .filter(
            (p) =>
                selectedCategory === "all" ||
                p.category === selectedCategory.replace(/[^a-z]/gi, "")
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const addToCart = (product) => {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        toast({
            title: "Added to cart!",
            description: `${product.name} has been added.`,
        });
    };

    const updateQuantity = (id, change) => {
        setCart(
            cart
                .map((item) => {
                    if (item.id === id) {
                        const q = item.quantity + change;
                        return q > 0 ? { ...item, quantity: q } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const getCartTotal = () =>
        cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const getCartItemCount = () =>
        cart.reduce((total, item) => total + item.quantity, 0);

    const handleCheckout = () => {
        if (!cart.length) {
            toast({
                title: "Cart is empty",
                description: "Add some items to your cart first!",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "🚧 Checkout coming soon!",
            description: "Stay tuned for premium checkout experience.",
        });
    };

    return (
        <section className="relative py-20 px-4">
            {/* Decorative Blobs */}
            <motion.div
                className="absolute top-0 left-0 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-20"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[25rem] h-[25rem] rounded-full blur-3xl opacity-20"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--secondary) / 0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-3">
                        GH GAMBIT Store
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
                        Elevate your game with official GH GAMBIT gear.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Filters */}
                        <div className="glass-base rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                <span>Filters</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value.replace(/[^a-z]/gi, ""))
                                        }
                                        className="input-glass"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value.replace(/[^a-z-]/gi, ""))
                                        }
                                        className="input-glass"
                                    >
                                        <option value="name">Name</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Cart */}
                        <div className="glass-base rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                <span>Cart ({getCartItemCount()})</span>
                            </h3>
                            {cart.length > 0 ? (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{item.name}</div>
                                                <div className="text-muted text-xs">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-1 rounded hover:bg-muted/20 transition-colors duration-300"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-1 rounded hover:bg-muted/20 transition-colors duration-300"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t border-border pt-4">
                                        <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span className="text-primary">
                                                ${getCartTotal().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button className="w-full" onClick={handleCheckout}>
                                        Checkout
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-muted text-center py-4">Your cart is empty</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Products */}
                    <div className="lg:col-span-3">
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.6 }}
                                    className="glass-base rounded-2xl p-5 hover:scale-[1.03] transition-all duration-300"
                                >
                                    <div className="aspect-square mb-4 rounded-xl overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                        <p className="text-muted text-sm line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-gold fill-gold" />
                                            <span className="text-sm font-medium">
                                                {product.rating}
                                            </span>
                                            <span className="text-muted text-xs">
                                                {product.stock} left
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-bold text-primary">
                                                ${product.price}
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                                className="flex items-center gap-1"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span className="hidden sm:inline">Add</span>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Merchandise;
