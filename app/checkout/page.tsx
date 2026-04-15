"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, CartItem } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, settings } = useStore();
  const [deliveryMethod, setDeliveryMethod] = useState<"priority" | "standard">("priority");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card");

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const shipping = deliveryMethod === "priority" ? 12.00 : 0.00;
  const tax = subtotal * 0.05; // 5% estimated tax
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-napkin flex flex-col pt-32 pb-20 px-6 items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <h2 className="serif text-4xl mb-6 italic text-crema">Your basket is resting.</h2>
          <p className="monolith text-xs opacity-40 mb-10 leading-relaxed tracking-wider">
            It seems you haven't selected any artisan items yet. Return to our menu to curate your experience.
          </p>
          <a href="/menu" className="no-underline">
            <button className="bg-crema text-white px-10 py-4 rounded-full monolith text-[10px] tracking-[0.3em] uppercase hover:bg-roast transition-colors duration-300 shadow-xl shadow-crema/20">
              Return to Menu
            </button>
          </a>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-napkin text-roast font-sans">
      {/* Checkout Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-napkin/80 backdrop-blur-md border-b border-roast/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-6">
            <a href="/menu" className="group flex items-center gap-2 text-roast/40 hover:text-crema transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span className="monolith text-[10px] tracking-[0.2em] uppercase hidden md:inline">Back to Menu</span>
            </a>
            <h1 className="serif text-2xl italic tracking-tight">{settings.studioName || "Artisan Obsidian"}</h1>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-crema/5 rounded-full border border-crema/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8924A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="monolith text-[9px] tracking-[0.2em] uppercase text-crema font-bold">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Shipping Info */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full border border-roast/10 flex items-center justify-center monolith text-[10px] opacity-50 tracking-widest bg-white">01</div>
                <h2 className="serif text-3xl italic">Shipping Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">First Name</label>
                  <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="Julian" />
                </div>
                <div className="space-y-2.5">
                  <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">Last Name</label>
                  <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="Vandervall" />
                </div>
                <div className="md:col-span-2 space-y-2.5">
                  <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">Address Line 1</label>
                  <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="188 Drury Lane" />
                </div>
                <div className="space-y-2.5">
                  <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">City</label>
                  <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="London" />
                </div>
                <div className="space-y-2.5">
                  <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">Postcode</label>
                  <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="WC2B 5QD" />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full border border-roast/10 flex items-center justify-center monolith text-[10px] opacity-50 tracking-widest bg-white">02</div>
                <h2 className="serif text-3xl italic">Delivery Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => setDeliveryMethod("priority")}
                  className={`flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-500 ${deliveryMethod === "priority" ? "bg-crema/5 border-crema shadow-lg shadow-crema/10" : "bg-white border-roast/5 hover:border-roast/20"}`}
                >
                  <div className="flex justify-between w-full mb-4">
                    <span className="serif text-lg italic">Priority Courier</span>
                    <span className="serif text-lg">£12.00</span>
                  </div>
                  <span className="monolith text-[9px] tracking-[0.1em] opacity-40">Next business day arrival</span>
                </button>
                <button 
                  onClick={() => setDeliveryMethod("standard")}
                  className={`flex flex-col items-start text-left p-6 rounded-2xl border transition-all duration-500 ${deliveryMethod === "standard" ? "bg-crema/5 border-crema shadow-lg shadow-crema/10" : "bg-white border-roast/5 hover:border-roast/20"}`}
                >
                  <div className="flex justify-between w-full mb-4">
                    <span className="serif text-lg italic">Standard Post</span>
                    <span className="serif text-lg">Free</span>
                  </div>
                  <span className="monolith text-[9px] tracking-[0.1em] opacity-40">3–5 business days</span>
                </button>
              </div>
            </section>

            {/* Payment Details */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-8 rounded-full border border-roast/10 flex items-center justify-center monolith text-[10px] opacity-50 tracking-widest bg-white">03</div>
                <h2 className="serif text-3xl italic">Payment Details</h2>
              </div>
              <div className="bg-white rounded-3xl border border-roast/5 overflow-hidden">
                <div className="flex border-b border-roast/5">
                  <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-5 flex items-center justify-center gap-3 transition-colors duration-300 ${paymentMethod === "card" ? "bg-crema text-white" : "bg-white text-roast/40 hover:bg-crema/5"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span className="monolith text-[10px] tracking-[0.2em] uppercase font-bold">Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod("apple")}
                    className={`flex-1 py-5 flex items-center justify-center gap-3 transition-colors duration-300 ${paymentMethod === "apple" ? "bg-black text-white" : "bg-white text-roast/40 hover:bg-black/5"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                    </svg>
                    <span className="monolith text-[10px] tracking-[0.2em] uppercase font-bold">Apple Pay</span>
                  </button>
                </div>
                <div className="p-8 space-y-6 bg-[#FCFBFA]">
                  <div className="space-y-2.5">
                    <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">Card Number</label>
                    <div className="relative">
                      <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="0000 0000 0000 0000" />
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">Expiry Date</label>
                      <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="monolith text-[10px] tracking-[0.2em] uppercase text-roast/60 font-medium ml-1">CVV</label>
                      <input type="text" className="w-full bg-white border border-roast/10 rounded-xl px-4 py-4 text-sm focus:border-crema focus:ring-1 focus:ring-crema outline-none transition-all duration-300 shadow-sm" placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-[#FCFBFA] rounded-[32px] p-8 lg:p-12 border border-roast/10 shadow-xl shadow-roast/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-crema/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <h2 className="serif text-3xl mb-12 italic relative z-10">Order Summary</h2>
              
              <div className="space-y-8 mb-12 max-h-[40vh] overflow-y-auto pr-4 scrollbar-thin">
                {cart.map((item, index) => (
                  <motion.div 
                    layout
                    key={item.id || `cart-item-${index}-${item.name}`}
                    className="flex gap-6 items-center group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-roast/10 shadow-sm relative z-10">
                      <img src={item.image || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="serif text-lg italic leading-tight mb-1">{item.name}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 flex items-center justify-center rounded-full border border-roast/10 text-roast/40 hover:text-crema hover:border-crema transition-colors duration-300">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="serif text-sm italic opacity-60">Qty: {item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 flex items-center justify-center rounded-full border border-roast/10 text-roast/40 hover:text-crema hover:border-crema transition-colors duration-300">
                             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="monolith text-[8px] tracking-[0.2em] uppercase text-crema/40 hover:text-crema transition-colors duration-300">Remove</button>
                      </div>
                    </div>
                    <span className="serif text-lg italic text-crema whitespace-nowrap">{item.price}</span>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-roast/5 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="monolith text-[10px] tracking-[0.1em] opacity-40 uppercase">Subtotal</span>
                  <span className="serif italic">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="monolith text-[10px] tracking-[0.1em] opacity-40 uppercase">Shipping</span>
                  <span className="serif italic">£{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="monolith text-[10px] tracking-[0.1em] opacity-40 uppercase">Estimated Tax</span>
                  <span className="serif italic">£{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="serif text-xl italic uppercase tracking-wider">Total</span>
                  <span className="serif text-4xl italic text-crema font-bold">£{total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  alert("Order submitted! In a real application, this would redirect to Stripe/Apple Pay.");
                }}
                className="w-full bg-crema text-white py-6 rounded-2xl shadow-2xl shadow-crema/20 monolith text-xs tracking-[0.4em] uppercase font-bold hover:bg-roast transition-all duration-500"
              >
                Complete Order
              </motion.button>
              
              <div className="mt-8 text-center">
                <p className="monolith text-[8px] tracking-[0.2em] opacity-30 uppercase">Guaranteed Secure Checkout via Stripe</p>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 translate-x-4">
              <div className="bg-white/40 p-5 rounded-2xl border border-crema/10 flex flex-col items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8924A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 20l1-5h-3l1-5h3l1-5h3l-1 5h3l-1 5h-3l-1 5z" />
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span className="monolith text-[8px] tracking-[0.2em] uppercase opacity-60">Eco-friendly Shipping</span>
              </div>
              <div className="bg-white/40 p-5 rounded-2xl border border-crema/10 flex flex-col items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8924A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="monolith text-[8px] tracking-[0.2em] uppercase opacity-60">2 Year Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <footer className="py-12 bg-white border-t border-roast/5">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="serif italic text-lg">{settings.studioName || "Artisan Obsidian"}</span>
          <div className="flex gap-8">
            <a href="#" className="monolith text-[9px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-300">Privacy Policy</a>
            <a href="#" className="monolith text-[9px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity duration-300">Terms of Service</a>
          </div>
          <span className="monolith text-[9px] tracking-[0.2em] uppercase opacity-30">© 2024 {settings.studioName || "Artisan Obsidian"} Luxury Coffee. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
