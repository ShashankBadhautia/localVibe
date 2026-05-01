import React, { createContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    setWishlistItems(wishlistService.getWishlist());
  }, []);

  const addToWishlist = (productId) => {
    if (!wishlistItems.includes(productId)) {
      const newWishlist = [...wishlistItems, productId];
      setWishlistItems(newWishlist);
      wishlistService.saveWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlistItems.filter(id => id !== productId);
    setWishlistItems(newWishlist);
    wishlistService.saveWishlist(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
