import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    Plus,
    Minus,
    Sparkles,
    TrendingUp,
    Package,
    Shield,
    X,
    ChevronRight,
    Zap,
    Crown,
    Diamond
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Merchandise = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState(null);

    useEffect(() => {
        const savedProducts = localStorage.getItem("ghgambit_products");
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            const mockProducts = [
                {
                    id: 1,
                    name: "Elite Home Jersey",
                    price: 289.99,
                    category: "jerseys",
                    image: "https://images.unsplash.com/photo-1635865165118-917ed9e20936",
                    rating: 4.9,
                    stock: 12,
                    description: "Championship Edition • Limited Release",
                    badge: "EXCLUSIVE",
                    featured: true
                },
                {
                    id: 2,
                    name: "Pro Basketball",
                    price: 149.99,
                    category: "equipment",
                    image: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a",
                    rating: 4.8,
                    stock: 8,
                    description: "Official Match Ball • Premium Grip",
                    badge: "PRO",
                    featured: true
                },
                {
                    id: 3,
                    name: "Signature Cap",
                    price: 79.99,
                    category: "accessories",
                    image: "https://images.unsplash.com/photo-1620207418302-439b387441b0",
                    rating: 4.7,
                    stock: 25,
                    description: "Limited Edition • Premium Materials"
                },
                {
                    id: 4,
                    name: "Performance Shorts",
                    price: 119.99,
                    category: "apparel",
                    image: "https://images.unsplash.com/photo-1602810318383-e6e1219a3b6f",
                    rating: 4.8,
                    stock: 18,
                    description: "Pro Athlete Design • Elite Comfort"
                },
                {
                    id: 5,
                    name: "Championship Hoodie",
                    price: 199.99,
                    category: "apparel",
                    image: "https://images.unsplash.com/photo-1618354691471-d9e9a8f20c05",
                    rating: 5.0,
                    stock: 5,
                    description: "Luxury Cotton • Signature Design",
                    badge: "BESTSELLER",
                    featured: true
                },
                {
                    id: 6,
                    name: "Elite Bottle",
                    price: 59.99,
                    category: "accessories",
                    image: "https://images.unsplash.com/photo-1617196039897-7f07cf14e584",
                    rating: 4.6,
                    stock: 30,
                    description: "Smart Temperature • Premium Steel"
                }
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
        { id: "all", label: "All", icon: <Sparkles className="w-4 h-4" /> },
        { id: "jerseys", label: "Jerseys", icon: <Shield className="w-4 h-4" /> },
        { id: "apparel", label: "Apparel", icon: <Crown className="w-4 h-4" /> },
        { id: "accessories", label: "Accessories", icon: <Diamond className="w-4 h-4" /> },
        { id: "equipment", label: "Equipment", icon: <Package className="w-4 h-4" /> }
    ];

    const sanitizeInput = (value) => {
        const cleaned = String(value).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/[<>]/g, '')
            .trim();
        return cleaned.substring(0, 50);
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => selectedCategory === "all" || p.category === selectedCategory)
            .sort((a, b) => {
                switch (sortBy) {
                    case "price-low": return a.price - b.price;
                    case "price-high": return b.price - a.price;
                    case "rating": return b.rating - a.rating;
                    case "featured": return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                    default: return a.name.localeCompare(b.name);
                }
            });
    }, [products, selectedCategory, sortBy]);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        toast({
            title: "✨ Added to collection",
            description: `${product.name} secured`,
            className: "glass-base"
        });
    };

    const updateQuantity = (id, change) => {
        const product = products.find(p => p.id === id);
        setCart(cart
            .map(item => {
                if (item.id === id) {
                    const newQty = Math.max(0, Math.min(item.quantity + change, product?.stock || 99));
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            })
            .filter(Boolean));
    };

    const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

    const isMobile = window.innerWidth < 768;

    return (
        <section className="relative min-h-screen py-8 md:py-16 overflow-hidden">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] rounded-full blur-[120px]"
                    style={{
                        background: `radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 65%)`
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-20%] right-[-10%] w-[35rem] h-[35rem] rounded-full blur-[100px]"
                    style={{
                        background: `radial-gradient(circle, hsl(var(--gold) / 0.1), transparent 60%)`
                    }}
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-10 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-6 h-6 text-gold" />
                        </motion.div>
                        <span className="badge-glass text-xs font-semibold tracking-wider text-gold">
                            EXCLUSIVE COLLECTION
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                        GH GAMBIT
                    </h1>
                    <p className="text-muted text-sm md:text-base max-w-md mx-auto">
                        Elite gear for champions
                    </p>
                </motion.div>

                {/* Categories - Mobile Horizontal Scroll */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-8 md:mb-12"
                >
                    <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {categories.map((cat, i) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.32 }}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                                    flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-2xl
                                    transition-all duration-320 whitespace-nowrap font-medium text-sm
                                    ${selectedCategory === cat.id
                                        ? 'glass-base bg-gradient-to-r from-primary/20 to-gold/10 text-foreground shadow-liquid'
                                        : 'glass-base hover:scale-105 text-muted hover:text-foreground'
                                    }
                                `}
                            >
                                <span className={selectedCategory === cat.id ? 'text-primary' : ''}>
                                    {cat.icon}
                                </span>
                                <span className="hidden md:inline">{cat.label}</span>
                                <span className="md:hidden">{cat.label.slice(0, 3)}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Sort Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex justify-between items-center mb-6 md:mb-8"
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(sanitizeInput(e.target.value))}
                            className="glass-base px-3 py-1.5 rounded-xl text-sm font-medium bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-320"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price ↑</option>
                            <option value="price-high">Price ↓</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCartOpen(true)}
                        className="glass-base px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-all duration-320"
                    >
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{getCartCount()}</span>
                        {!isMobile && <span className="text-sm text-muted">Items</span>}
                    </motion.button>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    <AnimatePresence>
                        {filteredProducts.map((product, i) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                onHoverStart={() => setHoveredProduct(product.id)}
                                onHoverEnd={() => setHoveredProduct(null)}
                                className="group relative"
                            >
                                <div className="glass-base overflow-hidden hover:shadow-liquid transition-all duration-320 h-full">
                                    {/* Image Container */}
                                    <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                                        <motion.img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            animate={{
                                                scale: hoveredProduct === product.id ? 1.1 : 1
                                            }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320" />

                                        {product.badge && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-2 right-2 badge-glass backdrop-blur-xl bg-gradient-to-r from-primary/90 to-gold/90 text-white text-[10px] md:text-xs font-bold px-2 py-1"
                                            >
                                                {product.badge}
                                            </motion.div>
                                        )}

                                        {product.stock < 10 && (
                                            <div className="absolute bottom-2 left-2 badge-glass backdrop-blur-xl bg-error/90 text-white text-[10px] md:text-xs font-semibold px-2 py-1">
                                                {product.stock} left
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                                        <div>
                                            <h3 className="font-bold text-sm md:text-base lg:text-lg line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-muted text-[10px] md:text-xs line-clamp-1 mt-1">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, idx) => (
                                                <Sparkles
                                                    key={idx}
                                                    className={`w-3 h-3 ${idx < Math.floor(product.rating)
                                                        ? 'text-gold fill-gold'
                                                        : 'text-border'}`}
                                                />
                                            ))}
                                            <span className="text-[10px] md:text-xs text-muted ml-1">
                                                {product.rating}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/20">
                                            <div>
                                                <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                                                    ${product.price}
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                                className="glass-base p-2 md:p-2.5 rounded-xl hover:bg-primary/20 transition-all duration-320 group/btn"
                                            >
                                                {isMobile ? (
                                                    <Plus className="w-4 h-4 text-primary group-hover/btn:rotate-90 transition-transform duration-320" />
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <ShoppingBag className="w-4 h-4 text-primary" />
                                                        <ChevronRight className="w-3 h-3 text-primary group-hover/btn:translate-x-1 transition-transform duration-320" />
                                                    </div>
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Floating Cart Sidebar */}
                <AnimatePresence>
                    {isCartOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCartOpen(false)}
                                className="fixed inset-0 bg-overlay-dark backdrop-blur-sm z-40"
                            />
                            <motion.aside
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 h-full w-full md:w-[400px] glass-base rounded-l-3xl z-50 overflow-hidden"
                            >
                                <div className="h-full flex flex-col">
                                    {/* Cart Header */}
                                    <div className="glass-base rounded-t-none p-6 border-b border-border/20">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-gold/10">
                                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">Your Collection</h3>
                                                    <p className="text-xs text-muted">{getCartCount()} exclusive items</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ rotate: 90 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setIsCartOpen(false)}
                                                className="p-2 rounded-xl hover:bg-muted/10 transition-colors duration-320"
                                            >
                                                <X className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Cart Items */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {cart.length > 0 ? (
                                            <AnimatePresence>
                                                {cart.map((item, i) => (
                                                    <motion.div
                                                        key={item.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="glass-base p-4 hover:shadow-liquid transition-all duration-320"
                                                    >
                                                        <div className="flex gap-4">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-20 h-20 object-cover rounded-xl"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-sm">{item.name}</h4>
                                                                <p className="text-xs text-muted mt-1">
                                                                    ${item.price.toFixed(2)} each
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <motion.button
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => updateQuantity(item.id, -1)}
                                                                        className="p-1.5 rounded-lg glass-base hover:bg-error/10 transition-all duration-320"
                                                                    >
                                                                        <Minus className="w-3 h-3" />
                                                                    </motion.button>
                                                                    <span className="w-8 text-center font-semibold text-sm">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <motion.button
                                                                        whileTap={{ scale: 0.9 }}
                                                                        onClick={() => updateQuantity(item.id, 1)}
                                                                        className="p-1.5 rounded-lg glass-base hover:bg-success/10 transition-all duration-320"
                                                                    >
                                                                        <Plus className="w-3 h-3" />
                                                                    </motion.button>
                                                                    <div className="ml-auto font-bold text-primary">
                                                                        ${(item.price * item.quantity).toFixed(2)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        ) : (
                                            <div className="text-center py-12">
                                                <ShoppingBag className="w-16 h-16 mx-auto text-muted/30 mb-4" />
                                                <p className="text-muted">Your collection is empty</p>
                                                <p className="text-xs text-muted mt-2">Add exclusive items to get started</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cart Footer */}
                                    {cart.length > 0 && (
                                        <div className="glass-base rounded-b-none p-6 border-t border-border/20">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted">Subtotal</span>
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                                                        ${getCartTotal().toFixed(2)}
                                                    </span>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full glass-base bg-gradient-to-r from-primary/90 to-gold/90 text-white font-bold py-4 rounded-xl hover:shadow-liquid transition-all duration-320 flex items-center justify-center gap-2"
                                                    onClick={() => {
                                                        toast({
                                                            title: "⚡ Premium checkout coming soon",
                                                            description: "Exclusive experience in development",
                                                            className: "glass-base"
                                                        });
                                                    }}
                                                >
                                                    <Zap className="w-4 h-4" />
                                                    Secure Checkout
                                                </motion.button>
                                                <p className="text-center text-xs text-muted">
                                                    Free shipping on orders over $500
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Merchandise;