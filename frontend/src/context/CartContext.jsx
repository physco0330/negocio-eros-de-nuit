import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === producto.id);
      if (existing) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const updateItem = (productoId, cantidad) => {
    if (cantidad <= 0) {
      removeItem(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const removeItem = (productoId) => {
    setItems((prev) => prev.filter((item) => item.id !== productoId));
  };

  const clearCart = () => setItems([]);

  const getSubtotal = () =>
    items.reduce((sum, item) => sum + item.precioVenta * item.cantidad, 0);

  const getDescuentoTotal = () =>
    items.reduce((sum, item) => {
      const descuento = item.descuentoPorcentaje > 0
        ? item.precioVenta * item.cantidad * (item.descuentoPorcentaje / 100)
        : 0;
      return sum + descuento;
    }, 0);

  const getTotal = () => getSubtotal() - getDescuentoTotal();

  const getItemCount = () => items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        getSubtotal,
        getDescuentoTotal,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
