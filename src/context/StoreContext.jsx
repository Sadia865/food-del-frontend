import { createContext, useEffect, useState } from "react";
import { food_list as defaultFoodList } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState(defaultFoodList);
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const url = "http://localhost:4000";

  /* ---------------- CART FUNCTIONS ---------------- */
  const addToCart = async (itemId) => {
    // Update UI immediately
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
    }));

    // Sync with backend if logged in
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token: token } }
        );
        console.log("Add to cart response:", response.data);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 0,
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token: token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const clearItem = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: 0,
    }));

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token: token } }
        );
      } catch (error) {
        console.error("Error clearing item:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  const getCartTotalPrice = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const item = food_list.find(
        (f) => f._id === itemId || f.id === itemId
      );
      return item ? total + item.price * qty : total;
    }, 0);
  };

  /* ---------------- AUTH ---------------- */
  const login = async (tokenValue) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    setIsLoggedIn(true);
    
    // Load cart data after login
    try {
      const res = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: tokenValue } }
      );
      console.log("Cart loaded after login:", res.data);
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.error("Error loading cart after login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setIsLoggedIn(false);
  };

  /* ---------------- API CALLS ---------------- */
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (savedToken) => {
    try {
      const res = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: savedToken } }
      );
      console.log("Cart loaded on page load:", res.data);
      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  /* ---------------- INITIALIZATION ---------------- */
  useEffect(() => {
    const initializeApp = async () => {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setIsLoggedIn(true);
        await loadCartData(savedToken);
      }
    };

    initializeApp();
  }, []);

  /* ---------------- CONTEXT ---------------- */
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearItem,
    getTotalCartAmount,
    getCartTotalPrice,
    isLoggedIn,
    login,
    logout,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;