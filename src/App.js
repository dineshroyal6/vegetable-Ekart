import { useEffect, useState } from "react";
import BannerSection from "./Components/BannerSection";
import BlogSection from "./Components/BlogSection";
import Category from "./Components/Category";
import Featuresectionbreakfast from "./Components/Featuresectionbreakfast";
import FeatureSectionFruits from "./Components/FeatureSectionFruits";
import Hero from "./Components/Hero";
import Navbar from "./Navbar";
import "./App.css";

const readStoredValue = (key, fallback) => {
  const storedValue = window.localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallback;
};

const hashPassword = async (password, salt) => {
  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

const App = () => {
  const [cartItems, setCartItems] = useState(() =>
    readStoredValue("vegetable-ekart-cart", [])
  );
  const [user, setUser] = useState(() =>
    readStoredValue("vegetable-ekart-user", null)
  );

  useEffect(() => {
    window.localStorage.setItem("vegetable-ekart-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("vegetable-ekart-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("vegetable-ekart-user");
    }
  }, [user]);

  const addToCart = (product) => {
    setCartItems((items) => {
      const existingItem = items.find(
        (item) => item.name === product.name && item.price === product.price
      );
      if (existingItem) {
        return items.map((item) =>
          item.name === product.name && item.price === product.price
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (product, quantity) => {
    setCartItems((items) =>
      quantity < 1
        ? items.filter(
            (item) =>
              item.name !== product.name || item.price !== product.price
          )
        : items.map((item) =>
            item.name === product.name && item.price === product.price
              ? { ...item, quantity }
              : item
          )
    );
  };

  const authenticate = async ({ mode, name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = readStoredValue("vegetable-ekart-accounts", []);
    const existingAccount = accounts.find(
      (account) => account.email === normalizedEmail
    );

    if (mode === "signup") {
      if (existingAccount) {
        return "An account with this email already exists. Please log in.";
      }

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const passwordHash = await hashPassword(password, salt);
      const account = {
        name: name.trim(),
        email: normalizedEmail,
        salt: Array.from(salt),
        passwordHash,
      };
      window.localStorage.setItem(
        "vegetable-ekart-accounts",
        JSON.stringify([...accounts, account])
      );
      setUser({ name: account.name, email: account.email });
      return null;
    }

    if (!existingAccount) {
      return "No account found for this email. Please sign up first.";
    }

    const passwordHash = await hashPassword(
      password,
      new Uint8Array(existingAccount.salt)
    );
    if (passwordHash !== existingAccount.passwordHash) {
      return "The password is incorrect.";
    }

    setUser({ name: existingAccount.name, email: existingAccount.email });
    return null;
  };

  const signOut = () => setUser(null);

  return (
    <main>
      <Navbar
        user={user}
        cartItems={cartItems}
        onAuthenticate={authenticate}
        onSignOut={signOut}
        onUpdateCartQuantity={updateCartQuantity}
      />
      <Hero />
      <Category />
      <FeatureSectionFruits onAddToCart={addToCart} />
      <Featuresectionbreakfast onAddToCart={addToCart} />
      <BannerSection />
      <BlogSection />
    </main>
  );
};

export default App;
