import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            } else {
                return {
                    ...state,
                    items: [...state.items, { ...action.payload, quantity: 1 }]
                };
            }

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                ).filter(item => item.quantity > 0)
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        case 'LOAD_CART':
            return {
                ...state,
                items: action.payload || []
            };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: []
    });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('nui_tea_cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: cartData });
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('nui_tea_cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return state.items.reduce((total, item) => {
            const basePrice = item.price || 0;
            const toppingPrice = calculateToppingPrice(item.options?.toppings);
            return total + (basePrice + toppingPrice) * item.quantity;
        }, 0);
    };

    // Hàm tính giá topping
    const calculateToppingPrice = (toppings) => {
        if (!toppings || toppings.length === 0) return 0;

        const toppingPrices = {
            'tran-chau-den': 7000,
            'thach-dua': 5000,
            'pudding-trung': 6000,
            'kem-cheese': 8000,
            'thach-trai-cay': 5000,
            'thach-dao': 5000
        };

        return toppings.reduce((total, topping) => {
            return total + (toppingPrices[topping] || 0);
        }, 0);
    };

    const value = {
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 