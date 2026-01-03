"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight, Check, Grid, List as ListIcon, Menu, X, Home, Settings, RotateCcw, CreditCard, Banknote, Percent, DollarSign, FileText } from "lucide-react";
import Link from "next/link";

// --- Types ---
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    colors: string[];
    sizes: string[];
    stock: number;
}

interface CartItem {
    id: number; // unique id for cart entry
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
}

interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'completed' | 'returned';
}

// --- Mock Data ---
// Replaced with verified working Unsplash IDs and added Stock
const PRODUCTS: Product[] = [
    { id: 1, name: "Premium Cotton T-Shirt", price: 25.00, category: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", colors: ["#000000", "#ffffff", "#1e3a8a"], sizes: ["S", "M", "L", "XL"], stock: 120 },
    { id: 2, name: "Slim Fit Denim Jeans", price: 49.99, category: "Pants", image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800", colors: ["#1e3a8a", "#000000"], sizes: ["30", "32", "34", "36"], stock: 85 },
    { id: 3, name: "Canvas Sneaker Pro", price: 55.00, category: "Footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800", colors: ["#ffffff", "#000000", "#ff0000"], sizes: ["7", "8", "9", "10", "11"], stock: 50 },
    { id: 4, name: "Vintage Floral Dress", price: 65.00, category: "Dresses", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800", colors: ["#ffb7b2"], sizes: ["XS", "S", "M", "L"], stock: 30 },
    { id: 5, name: "Minimalist Hoodie", price: 45.00, category: "Outerwear", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800", colors: ["#808080", "#000000"], sizes: ["S", "M", "L", "XL"], stock: 60 },
    { id: 6, name: "Leather Crossbody Bag", price: 89.00, category: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800", colors: ["#8B4513", "#000000"], sizes: ["One Size"], stock: 25 },
    { id: 7, name: "Summer Linen Shorts", price: 35.00, category: "Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800", colors: ["#F5F5DC", "#1e3a8a"], sizes: ["S", "M", "L"], stock: 100 },
    { id: 8, name: "Urban Backpack", price: 59.00, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800", colors: ["#000000"], sizes: ["One Size"], stock: 40 },
];

const CATEGORIES = ["All", "T-Shirts", "Pants", "Footwear", "Dresses", "Outerwear", "Accessories", "Shorts"];

// Mock Past Orders for Returns
const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-7829",
        date: "2026-01-02",
        items: [
            { id: 101, productId: 1, name: "Premium Cotton T-Shirt", price: 25.00, quantity: 2, image: PRODUCTS[0].image, color: "#000000", size: "M" },
            { id: 102, productId: 2, name: "Slim Fit Denim Jeans", price: 49.99, quantity: 1, image: PRODUCTS[1].image, color: "#1e3a8a", size: "32" }
        ],
        total: 99.99,
        status: 'completed'
    },
    {
        id: "ORD-7830",
        date: "2026-01-03",
        items: [
            { id: 103, productId: 5, name: "Minimalist Hoodie", price: 45.00, quantity: 1, image: PRODUCTS[4].image, color: "#808080", size: "L" }
        ],
        total: 45.00,
        status: 'completed'
    }
];

export default function PosPage() {
    // --- State ---
    const [mode, setMode] = useState<'sales' | 'returns'>('sales'); // Overall App Mode
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Sales View Mode
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Cart / Checkout State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [discount, setDiscount] = useState<{ type: 'percent' | 'fixed', value: number }>({ type: 'percent', value: 0 });
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');

    // Product Modal Selection State
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Returns State
    const [returnSearch, setReturnSearch] = useState("");
    const [foundOrder, setFoundOrder] = useState<Order | null>(null);
    const [selectedReturnItems, setSelectedReturnItems] = useState<{ [key: number]: number }>({}); // itemId -> quantity to return

    // --- Computed ---
    const filteredProducts = PRODUCTS.filter(p => {
        const matchCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = discount.type === 'percent' ? (subTotal * discount.value / 100) : discount.value;
    const taxAmount = (subTotal - discountAmount) * 0.10; // 10% Tax
    const finalTotal = Math.max(0, subTotal - discountAmount + taxAmount);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // --- Handlers: Sales ---
    const handleProductClick = (product: Product) => {
        setActiveProduct(product);
        setSelectedSize(product.sizes[0]);
        setSelectedColor(product.colors[0]);
        setQuantity(1);
    };

    const handleAddToCart = () => {
        if (!activeProduct || !selectedSize || !selectedColor) return;
        const newItem: CartItem = {
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

    const applyDiscount = (type: 'percent' | 'fixed', value: number) => {
        setDiscount({ type, value });
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        alert(`Processing ${paymentMethod.toUpperCase()} payment of $${finalTotal.toFixed(2)} for ${totalItems} items.\nStock updated!`);
        setCart([]);
        setDiscount({ type: 'percent', value: 0 });
    };

    // --- Handlers: Returns ---
    const handleSearchOrder = () => {
        const order = MOCK_ORDERS.find(o => o.id === returnSearch.trim());
        setFoundOrder(order || null);
        setSelectedReturnItems({});
        if (!order) alert("Order not found!");
    };

    const toggleReturnItem = (itemId: number, maxQty: number) => {
        setSelectedReturnItems(prev => {
            const current = prev[itemId] || 0;
            if (current > 0) {
                const newObj = { ...prev };
                delete newObj[itemId];
                return newObj;
            } else {
                return { ...prev, [itemId]: maxQty }; // Default to max return
            }
        });
    };

    const processReturn = () => {
        if (!foundOrder) return;
        const itemsToReturn = foundOrder.items.filter(item => selectedReturnItems[item.id] > 0);
        if (itemsToReturn.length === 0) {
            alert("No items selected for return.");
            return;
        }

        const refundTotal = itemsToReturn.reduce((sum, item) => sum + (item.price * selectedReturnItems[item.id]), 0);

        alert(`Processed return for Order #${foundOrder.id}.\nRefund Amount: $${refundTotal.toFixed(2)}\nStock updated! Sales record adjusted.`);

        // Reset
        setFoundOrder(null);
        setReturnSearch("");
        setSelectedReturnItems({});
    };


    // --- Render Helpers ---
    const renderCartContent = (isMobile: boolean) => (
        <div className="flex flex-col h-full bg-white">
            <div className={`p-5 md:p-6 border-b border-slate-100 flex justify-between items-center ${isMobile ? '' : 'hidden md:flex'}`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart className="text-primary" /> Current Order
                </h2>
                {isMobile && <button onClick={() => setIsCartOpen(false)}><X size={20} className="text-slate-400" /></button>}
            </div>

            {/* Cart Items */}
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
                                    <p className="font-bold text-sm text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    <div className="text-xs font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">x{item.quantity}</div>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 self-start transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))
                )}
            </div>

            {/* Checkout Area */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 shadow-inner">
                {/* Discount Controls */}
                <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Discount</p>
                    <div className="flex gap-2">
                        <button onClick={() => applyDiscount('percent', 10)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${discount.type === 'percent' && discount.value === 10 ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}>10%</button>
                        <button onClick={() => applyDiscount('percent', 20)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${discount.type === 'percent' && discount.value === 20 ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'}`}>20%</button>
                        <button onClick={() => applyDiscount('fixed', 0)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${discount.value === 0 ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-white text-slate-500 border-slate-200 hover:border-red-400 hover:text-red-400'}`}>None</button>
                    </div>
                </div>

                {/* Subtotal / Tax */}
                <div className="space-y-2 mb-4 text-sm text-slate-500">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subTotal.toFixed(2)}</span>
                    </div>
                    {discount.value > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount {discount.type === 'percent' ? `(${discount.value}%)` : 'Fixed'}</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-200 mb-4">
                    <div className="flex justify-between items-end">
                        <span className="text-slate-900 font-bold text-lg">Total</span>
                        <span className="text-2xl font-black text-primary">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === 'cash' ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                    >
                        <Banknote size={18} /> Cash
                    </button>
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === 'card' ? 'border-primary bg-blue-50 text-primary' : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'}`}
                    >
                        <CreditCard size={18} /> Card
                    </button>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center gap-2"
                >
                    Checkout <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden relative">

            {/* 1. Sidebar */}
            <aside className="hidden md:flex w-20 bg-white border-r border-slate-200 flex-col items-center py-6 gap-8 z-20">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">SW</div>
                <nav className="flex flex-col gap-6 w-full items-center">
                    <button
                        onClick={() => setMode('sales')}
                        className={`p-3 relative rounded-xl transition-all ${mode === 'sales' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Sales Mode"
                    >
                        <Grid size={24} />
                        {mode === 'sales' && <span className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                    </button>
                    <button
                        onClick={() => setMode('returns')}
                        className={`p-3 relative rounded-xl transition-all ${mode === 'returns' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Returns & Refunds"
                    >
                        <RotateCcw size={24} />
                        {mode === 'returns' && <span className="absolute -right-1 -top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                    </button>
                    <div className="w-8 h-px bg-slate-100 my-2"></div>
                    {/* View Toggles (Only for Sales) */}
                    {mode === 'sales' && (
                        <>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-primary bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ListIcon size={20} />
                            </button>
                        </>
                    )}
                </nav>
                <div className="mt-auto flex flex-col gap-4 items-center">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-3 text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <Settings size={24} />
                    </button>
                    <Link href="/">
                        <button className="p-3 text-slate-400 hover:text-red-500 transition-all"><ArrowLeft size={24} /></button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 z-40 flex justify-around items-center py-3 px-2 safe-area-bottom">
                <button onClick={() => setMode('sales')} className={`flex flex-col items-center gap-1 p-2 ${mode === 'sales' ? 'text-primary' : 'text-slate-400'}`}>
                    <Grid size={20} />
                    <span className="text-[10px] font-bold">Sales</span>
                </button>
                <button onClick={() => setMode('returns')} className={`flex flex-col items-center gap-1 p-2 ${mode === 'returns' ? 'text-primary' : 'text-slate-400'}`}>
                    <RotateCcw size={20} />
                    <span className="text-[10px] font-bold">Returns</span>
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

            {/* 2. Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full pb-20 md:pb-0 relative bg-slate-50/50">

                {/* Header */}
                <header className="px-4 md:px-8 py-4 md:py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center shrink-0">
                    <div className="flex justify-between w-full md:w-auto items-center">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{mode === 'sales' ? 'Sales Terminal' : 'Returns & Refunds'}</h1>
                            <p className="text-xs text-slate-400 font-medium">{new Date().toDateString()}</p>
                        </div>
                        {/* Mobile Cart Icon */}
                        {mode === 'sales' && (
                            <button onClick={() => setIsCartOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-full relative text-slate-600">
                                <ShoppingCart size={20} />
                                {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">{totalItems}</span>}
                            </button>
                        )}
                    </div>

                    {mode === 'sales' && (
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
                    )}
                </header>

                <AnimatePresence mode="wait">
                    {mode === 'sales' ? (
                        <motion.div
                            key="sales"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
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

                            {/* Product List */}
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
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-900 shadow-sm">
                                                        {product.stock} in stock
                                                    </div>
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
                                                        <span>{product.stock} Stock</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="returns"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto"
                        >
                            <div className="max-w-2xl w-full mx-auto space-y-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search size={20} className="text-primary" /> Find Order</h2>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Order ID (e.g., ORD-7829)"
                                            className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            value={returnSearch}
                                            onChange={(e) => setReturnSearch(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSearchOrder}
                                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary transition-colors"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>

                                {foundOrder && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
                                    >
                                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                                            <div>
                                                <p className="text-sm text-slate-500 font-medium">Order Details</p>
                                                <h3 className="text-2xl font-black text-slate-900">#{foundOrder.id}</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500 font-medium">Date</p>
                                                <p className="text-slate-900 font-bold">{foundOrder.date}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Select Items to Return</p>
                                        <div className="space-y-3 mb-6">
                                            {foundOrder.items.map(item => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => toggleReturnItem(item.id, item.quantity)}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedReturnItems[item.id] ? 'border-primary bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedReturnItems[item.id] ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                                                        {selectedReturnItems[item.id] && <Check size={14} />}
                                                    </div>
                                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                                                        <p className="text-xs text-slate-500">Qty: {item.quantity} • {item.size} • {item.color}</p>
                                                    </div>
                                                    <div className="font-bold text-slate-900">
                                                        ${(item.price * (selectedReturnItems[item.id] || item.quantity)).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-slate-100">
                                            <button
                                                onClick={processReturn}
                                                className="px-8 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <RotateCcw size={20} /> Process Refund
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 3. Right Sidebar (Desktop only) */}
            <aside className="hidden md:flex w-96 bg-white border-l border-slate-200 flex-col shadow-none z-30 h-full">
                {mode === 'sales' ? renderCartContent(false) : (
                    /* Returns Sidebar Info */
                    <div className="flex flex-col h-full bg-slate-50/50 p-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Return Policy</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Items can be returned within 30 days of purchase. Original receipt required. Items must be unworn and tags attached.
                            </p>
                        </div>
                    </div>
                )}
            </aside>

            {/* Mobile Cart Drawer */}
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
                            {renderCartContent(true)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Product Modal */}
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

                                    {/* Stock Indicator */}
                                    <div className="mb-6 flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                        <Check size={16} /> {activeProduct.stock} Units Available
                                    </div>

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
                                            <button onClick={() => setQuantity(Math.min(activeProduct.stock, quantity + 1))} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all"><Plus size={16} /></button>
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

            {/* Settings Modal */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Settings</h2>
                                <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <p className="text-slate-500">Settings panel...</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
