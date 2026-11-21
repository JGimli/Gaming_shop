import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'gaming-shop-cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (game) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === game.id);

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === game.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { ...game, quantity: 1 }];
        });
    };

    const removeItem = (gameId) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== gameId));
    };

    const decreaseQuantity = (gameId) => {
        setItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === gameId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const itemCount = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    );

    const total = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
                0
            ),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                itemCount,
                total,
                addItem,
                removeItem,
                decreaseQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
