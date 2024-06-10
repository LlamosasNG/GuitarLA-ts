import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { Guitar, CartItem } from "../types";

export default function useCart() {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  // States
  const [data] = useState(db); //Para un archivo local es adecuado extraer los datos al hook de esta manera
  const [cart, setCart] = useState(initialCart);

  // Para el manejo de API's es recomendable utilizar useEffect
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExists >= 0) {
      const updateCart = [...cart];
      updateCart[itemExists].quantity++;
      setCart(updateCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function increaseQuantity(id: Guitar["id"]) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function drecreaseQuantity(id: Guitar["id"]) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    drecreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  };
}
