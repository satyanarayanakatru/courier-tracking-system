import axios from 'axios';

const DUMMY_USERS_URL = 'https://dummyjson.com/users';

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-101',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    mobileNumber: '+1 (555) 019-2834',
    address: '55 SkyNet Blvd, Suite 400',
    city: 'Austin',
    postalCode: '78701',
    totalOrders: 14,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-102',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+1 (555) 018-4421',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    totalOrders: 8,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-20'
  },
  {
    id: 'cust-103',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    mobileNumber: '+1 (555) 017-9912',
    address: '456 Elm Street',
    city: 'Dallas',
    postalCode: '75201',
    totalOrders: 21,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-05'
  },
  {
    id: 'cust-104',
    name: 'Michael Scott',
    email: 'michael.scott@dundermifflin.com',
    mobileNumber: '+1 (555) 016-5543',
    address: '1725 Slough Avenue',
    city: 'Scranton',
    postalCode: '18503',
    totalOrders: 32,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-12'
  },
  {
    id: 'cust-105',
    name: 'Bruce Wayne',
    email: 'bruce@wayneenterprises.com',
    mobileNumber: '+1 (555) 015-7788',
    address: '1007 Mountain Drive',
    city: 'Gotham',
    postalCode: '07001',
    totalOrders: 45,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-04-01'
  },
  {
    id: 'cust-106',
    name: 'Pepper Potts',
    email: 'pepper.potts@stark.com',
    mobileNumber: '+1 (555) 014-3322',
    address: '10880 Malibu Point',
    city: 'Malibu',
    postalCode: '90265',
    totalOrders: 19,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-04-18'
  },
  {
    id: 'cust-107',
    name: 'Peter Parker',
    email: 'peter.parker@dailybugle.com',
    mobileNumber: '+1 (555) 013-1100',
    address: '20 Ingram Street',
    city: 'Queens',
    postalCode: '11375',
    totalOrders: 6,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-02'
  },
  {
    id: 'cust-108',
    name: 'Clark Kent',
    email: 'clark.kent@dailyplanet.com',
    mobileNumber: '+1 (555) 012-9988',
    address: '344 Clinton St, Apt 3B',
    city: 'Metropolis',
    postalCode: '10001',
    totalOrders: 11,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-05-24'
  }
];

export const getCustomers = async () => {
  const local = localStorage.getItem('courier_customers');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }

  // Fetch users from DummyJSON API
  try {
    const res = await axios.get(`${DUMMY_USERS_URL}?limit=12`);
    if (res.data && res.data.users && res.data.users.length > 0) {
      const fetchedCustomers = res.data.users.map((u, index) => ({
        id: `cust-${u.id}`,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        mobileNumber: u.phone || `+1 (555) 01${index}-8899`,
        address: u.address?.address || `${100 + index} Main Ave`,
        city: u.address?.city || 'Dallas',
        postalCode: u.address?.postalCode || '75001',
        totalOrders: Math.floor(Math.random() * 20) + 3,
        avatar: u.image || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        createdAt: `2026-0${(index % 5) + 1}-15`
      }));
      localStorage.setItem('courier_customers', JSON.stringify(fetchedCustomers));
      return fetchedCustomers;
    }
  } catch (e) {
    console.log('DummyJSON API offline, loading fallback initial customers dataset');
  }

  localStorage.setItem('courier_customers', JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
};

export const saveCustomers = (customers) => {
  localStorage.setItem('courier_customers', JSON.stringify(customers));
};
