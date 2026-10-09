import React from 'react';
import { AuthProvider } from './AuthContext';
import { ShipmentProvider } from './ShipmentContext';
import { CustomerProvider } from './CustomerContext';
import { NotificationProvider } from './NotificationContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CustomerProvider>
        <ShipmentProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ShipmentProvider>
      </CustomerProvider>
    </AuthProvider>
  );
};
