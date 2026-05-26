import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const getSavedCart = () => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getSavedCart);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        setCartItems((items) => {
            const existingItem = items.find((item) => item._id === product._id);

            if (existingItem) {
                return items.map((item) =>
                    item._id === product._id
                        ? { ...item, qty: Math.min(item.qty + qty, product.countInStock) }
                        : item
                );
            }

            return [...items, { ...product, qty }];
        });
    };

    const updateQty = (productId, qty) => {
        setCartItems((items) =>
            items.map((item) => item._id === productId ? { ...item, qty } : item)
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((items) => items.filter((item) => item._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        itemsCount: cartItems.reduce((total, item) => total + item.qty, 0),
        itemsPrice: cartItems.reduce((total, item) => total + item.qty * item.price, 0),
    }), [cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
