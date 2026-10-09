const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-101',
    title: 'Parcel Out for Delivery',
    message: 'Shipment #ST-994201 has been loaded onto Courier Truck #42 and is out for final delivery to John Doe.',
    type: 'delivery',
    unread: true,
    timestamp: '10 minutes ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    trackingNumber: 'ST-994201'
  },
  {
    id: 'notif-102',
    title: 'Delivery Confirmed',
    message: 'Shipment #ST-882194 was successfully delivered to Alice Johnson. Recipient signature recorded.',
    type: 'success',
    unread: true,
    timestamp: '35 minutes ago',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    trackingNumber: 'ST-882194'
  },
  {
    id: 'notif-103',
    title: 'Delivery Delay Alert',
    message: 'Shipment #ST-221589 delivery attempt failed due to uncontactable recipient. Rescheduled for tomorrow.',
    type: 'warning',
    unread: true,
    timestamp: '1 hour ago',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    trackingNumber: 'ST-221589'
  },
  {
    id: 'notif-104',
    title: 'New Customer Profile Registered',
    message: 'Customer Sarah Connor (sarah.connor@example.com) created a new shipping profile.',
    type: 'system',
    unread: false,
    timestamp: '3 hours ago',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-105',
    title: 'System Dispatch Update',
    message: 'Bulk status update performed by Courier Staff. 4 parcels updated to In Transit.',
    type: 'system',
    unread: false,
    timestamp: '5 hours ago',
    createdAt: new Date(Date.now() - 300 * 60 * 1000).toISOString()
  }
];

export const getNotifications = () => {
  const local = localStorage.getItem('courier_notifications');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem('courier_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
};

export const saveNotifications = (notifications) => {
  localStorage.setItem('courier_notifications', JSON.stringify(notifications));
  // Dispatch custom window event so Navbar badge updates instantly
  window.dispatchEvent(new Event('notifications_updated'));
};
