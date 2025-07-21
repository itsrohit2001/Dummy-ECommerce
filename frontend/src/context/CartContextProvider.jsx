// import React, { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartContextProvider = ({ children }) => {
//    const [cartItems, setCartItems] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [wishlistItems, setWishlistItems] = useState([]);

//   // Whenever cartItems changes, save to localStorage
//   useEffect(() => {
//   localStorage.setItem("cart", JSON.stringify(cartItems)); // local storage can only store strings
// }, [cartItems]);

//   const addToWishlist = (product) => {
//     if (!product || !product.id) return;
//     setWishlistItems((prev) => {
//       if (prev.find((item) => item.id === product.id)) return prev;
//       return [...prev, product];
//     });
//   };

//   const clearWishlist = () => {
//     setWishlistItems([]);
//   };

//   const addToCart = (product) => {
//     if (!product || !product.id) return;
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id
//             ? {
//                 ...item,
//                 quantity: (item.quantity || 1) + (product.quantity || 1),
//               }
//             : item
//         );
//       }
//       return [...prev, { ...product, quantity: product.quantity || 1 }];
//     });
//   };

//   const removeFromWishlist = (productId) => {
//     setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id, qty) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
//       )
//     );
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         wishlistItems,
//         addToWishlist,
//         clearWishlist,
//         removeFromWishlist,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };
