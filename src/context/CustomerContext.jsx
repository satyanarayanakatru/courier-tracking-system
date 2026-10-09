import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomers, saveCustomers } from '../services/customerService';
import { toast } from 'react-toastify';

const CustomerContext = createContext();

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = (customerData) => {
    const newCustomer = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: customerData.name,
      email: customerData.email,
      mobileNumber: customerData.mobileNumber,
      address: customerData.address,
      city: customerData.city,
      postalCode: customerData.postalCode,
      totalOrders: 0,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    saveCustomers(updated);
    toast.success(`New customer "${customerData.name}" added successfully!`);
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    const updated = customers.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setCustomers(updated);
    saveCustomers(updated);
    toast.success(`Customer "${updatedFields.name || 'details'}" updated!`);
  };

  const deleteCustomer = (id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    saveCustomers(updated);
    toast.info('Customer record deleted.');
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        totalCustomers: customers.length,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        refreshCustomers: loadCustomers
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
