import React, { createContext, useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(orderService.getOrders());
  }, []);

  const createOrder = (orderData) => {
    const newOrder = orderService.createOrder(orderData);
    setOrders(orderService.getOrders());
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    orderService.updateOrderStatus(orderId, status);
    setOrders(orderService.getOrders());
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
