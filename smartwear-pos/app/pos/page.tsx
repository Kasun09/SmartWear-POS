"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight, Check, Grid, List as ListIcon, Menu, X, Home, Settings } from "lucide-react";
import Link from "next/link"; // Added Link import

// --- Mock Data ---
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    colors: string[];
    sizes: string[];
}

// Replaced with verified working Unsplash IDs
const PRODUCTS: Product[] = [
    { id: 1, name: "Premium Cotton T-Shirt", price: 25.00, category: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", colors: ["#000000", "#ffffff", "#1e3a8a"], sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Slim Fit Denim Jeans", price: 49.99, category: "Pants", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800", colors: ["#1e3a8a", "#000000"], sizes: ["30", "32", "34", "36"] },
    { id: 3, name: "Canvas Sneaker Pro", price: 55.00, category: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800", colors: ["#ffffff", "#000000", "#ff0000"], sizes: ["7", "8", "9", "10", "11"] },
    { id: 4, name: "Vintage Floral Dress", price: 65.00, category: "Dresses", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800", colors: ["#ffb7b2"], sizes: ["XS", "S", "M", "L"] },
    { id: 5, name: "Minimalist Hoodie", price: 45.00, category: "Outerwear", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800", colors: ["#808080", "#000000"], sizes: ["S", "M", "L", "XL"] },
    { id: 6, name: "Leather Crossbody Bag", price: 89.00, category: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800", colors: ["#8B4513", "#000000"], sizes: ["One Size"] },
    { id: 7, name: "Summer Linen Shorts", price: 35.00, category: "Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800", colors: ["#F5F5DC", "#1e3a8a"], sizes: ["S", "M", "L"] },
    { id: 8, name: "Urban Backpack", price: 59.00, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800", colors: ["#000000"], sizes: ["One Size"] },
];

const CATEGORIES = ["All", "T-Shirts", "Pants", "Footwear", "Dresses", "Outerwear", "Accessories", "Shorts"];

export default function PosPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<{ id: number; productId: number; name: string; price: number; quantity: number; image: string; color: string; size: string }[]>([]);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false); // Mobile Cart Toggle
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // View Mode State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings Modal State

    // Selection State
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const filteredProducts = PRODUCTS.filter(p => {
        const matchCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const handleProductClick = (product: Product) => {
        setActiveProduct(product);
        setSelectedSize(product.sizes[0]);
        setSelectedColor(product.colors[0]);
        setQuantity(1);
    };

    const handleAddToCart = () => {
        if (!activeProduct || !selectedSize || !selectedColor) return;

        const newItem = {
            id: Date.now(),
            productId: activeProduct.id,
            name: activeProduct.name,
            price: activeProduct.price,
            image: activeProduct.image,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        };

        setCart([...cart, newItem]);
        setActiveProduct(null);
    };

    const removeFromCart = (itemId: number) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden relative">

            {/* 1. Sidebar (Desktop) / Bottom Nav (Mobile) */}
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-20 bg-white border-r border-slate-200 flex-col items-center py-6 gap-8 z-20">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">SW</div>
                <nav className="flex flex-col gap-6 w-full items-center">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Grid size={24} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-50 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ListIcon size={24} />
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className={`p-3 rounded-xl transition-all ${isSettingsOpen ? 'bg-blue-50 text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Settings size={24} />
                    </button>
                </nav>
                <div className="mt-auto">
                    <Link href="/">
                        <button className="p-3 text-slate-400 hover:text-red-500 transition-all"><ArrowLeft size={24} /></button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-40 flex justify-around items-center py-3 px-2 safe-area-bottom">
                <Link href="/">
                    <button className="flex flex-col items-center gap-1 text-slate-400 p-2">
                        <Home size={20} />
                        <span className="text-[10px] font-bold">Home</span>
                    </button>
                </Link>
                <button className="flex flex-col items-center gap-1 text-primary p-2">
                    <Grid size={20} />
                    <span className="text-[10px] font-bold">POS</span>
                </button>
                <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-slate-400 p-2 relative">
                    <div className="relative">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">{totalItems}</span>}
                    </div>
                    <span className="text-[10px] font-bold">Cart</span>
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center gap-1 text-slate-400 p-2">
                    <Settings size={20} />
                    <span className="text-[10px] font-bold">Settings</span>
                </button>
            </nav>

            {/* 2. Main Product Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full pb-20 md:pb-0 relative">

                {/* Header */}
                <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center shrink-0">
                    <div className="flex justify-between w-full md:w-auto items-center">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Ordering</h1>
                            <p className="text-xs text-slate-400 font-medium">{new Date().toDateString()}</p>
                        </div>
                        {/* Mobile Cart Icon in Header */}
                        <button onClick={() => setIsCartOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-full relative text-slate-600">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">{totalItems}</span>}
                        </button>
                    </div>

                    <div className="w-full md:w-auto relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-slate-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {/* Categories */}
                <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2 shrink-0">
                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid / List */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-2 md:pt-4">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 pb-20">
                            {filteredProducts.map(product => (
                                <motion.div
                                    layoutId={`product-${product.id}`}
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className="group bg-white rounded-xl md:rounded-2xl p-2 md:p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                                >
                                    <div className="relative aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-3 bg-slate-100">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <div className="px-1">
                                        <h3 className="font-bold text-slate-800 truncate text-sm md:text-base">{product.name}</h3>
                                        <p className="text-primary font-bold text-xs md:text-sm mt-0.5 md:mt-1">${product.price.toFixed(2)}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pb-20">
                            {filteredProducts.map(product => (
                                <motion.div
                                    layoutId={`product-${product.id}`}
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className="flex items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer gap-4"
                                >
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <span>{product.category}</span>
                                            <span>•</span>
                                            <span>{product.sizes.length} Sizes</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>
                                        <button className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg mt-1 group-hover:bg-primary group-hover:text-white transition-colors">ADD</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* 3. Cart Panel */}
            {/* Desktop Cart (Always visible on desktop, hidden on mobile) */}
            <aside className="hidden md:flex w-96 bg-white border-l border-slate-200 flex-col shadow-none z-30 h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="text-primary" /> Current Order
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                            <ShoppingCart size={48} strokeWidth={1} />
                            <p>No items in cart</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.size} • <span className="inline-block w-2 h-2 rounded-full border border-slate-200 ml-1" style={{ backgroundColor: item.color }}></span></p>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                        <div className="text-xs font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">x{item.quantity}</div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 self-start transition-colors"><Trash2 size={16} /></button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax (10%)</span>
                            <span>${(totalAmount * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-200">
                            <span>Total</span>
                            <span>${(totalAmount * 1.1).toFixed(2)}</span>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-primary transition-colors flex justify-center gap-2">
                        Checkout <ArrowRight size={20} />
                    </button>
                </div>
            </aside>

            {/* Mobile Cart Drawer (Slide over) */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full z-50 w-[85vw] bg-white border-l border-slate-200 shadow-2xl flex flex-col md:hidden"
                        >
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <ShoppingCart className="text-primary" /> Current Order
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                                        <ShoppingCart size={48} strokeWidth={1} />
                                        <p>No items in cart</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                            <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-white shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.size} • <span className="inline-block w-2 h-2 rounded-full border border-slate-200 ml-1" style={{ backgroundColor: item.color }}></span></p>
                                                <div className="flex justify-between items-end mt-2">
                                                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <div className="text-xs font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">x{item.quantity}</div>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 self-start transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-5 bg-slate-50 border-t border-slate-200">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Tax (10%)</span>
                                        <span>${(totalAmount * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-200">
                                        <span>Total</span>
                                        <span>${(totalAmount * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-primary transition-colors flex justify-center gap-2">
                                    Checkout <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* 4. Product Modal (Responsive Overlay) */}
            <AnimatePresence>
                {activeProduct && (
                    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveProduct(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`product-${activeProduct.id}`}
                            className="relative w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-auto"
                        >
                            <button onClick={() => setActiveProduct(null)} className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full md:hidden">
                                <X size={20} />
                            </button>

                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-slate-100 shrink-0">
                                <Image src={activeProduct.image} alt={activeProduct.name} fill className="object-cover" />
                            </div>

                            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{activeProduct.name}</h2>
                                    <p className="text-primary text-xl font-bold mb-6">${activeProduct.price.toFixed(2)}</p>

                                    {/* Size Selector */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Select Size</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {activeProduct.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border ${selectedSize === size ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selector */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Select Color</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {activeProduct.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all relative ${selectedColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent ring-1 ring-slate-200'}`}
                                                    style={{ backgroundColor: color }}
                                                >
                                                    {selectedColor === color && <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference"><Check size={12} strokeWidth={4} /></span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-8 flex items-center gap-4">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Quantity</h3>
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all"><Minus size={16} /></button>
                                            <span className="font-bold w-4 text-center">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Add to Order
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 5. Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Settings</h2>
                                <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="font-medium text-slate-700">Dark Mode</span>
                                    <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <span className="font-medium text-slate-700">Notifications</span>
                                    <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <button className="w-full py-3 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
