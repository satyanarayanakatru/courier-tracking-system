import axios from 'axios';

const DUMMY_API_URL = 'https://dummyjson.com/carts';

const INITIAL_SHIPMENTS = [
  {
    id: 'shp-101',
    trackingNumber: 'ST-994201',
    senderName: 'Robert Vance',
    receiverName: 'John Doe',
    pickupAddress: '742 Evergreen Terrace, Springfield, OR',
    deliveryAddress: '100 Universal City Plaza, Los Angeles, CA',
    parcelWeight: 3.5,
    parcelType: 'Standard Parcel',
    shippingDate: '2026-10-01',
    expectedDeliveryDate: '2026-10-06',
    deliveryStatus: 'In Transit',
    notes: 'Fragile handle with care'
  },
  {
    id: 'shp-102',
    trackingNumber: 'ST-882194',
    senderName: 'Emily Clark',
    receiverName: 'Alice Johnson',
    pickupAddress: '221B Baker Street, London, UK',
    deliveryAddress: '456 Elm Street, Dallas, TX',
    parcelWeight: 1.2,
    parcelType: 'Document Express',
    shippingDate: '2026-09-28',
    expectedDeliveryDate: '2026-10-02',
    deliveryStatus: 'Delivered',
    notes: 'Urgent legal documents'
  },
  {
    id: 'shp-103',
    trackingNumber: 'ST-773019',
    senderName: 'Michael Scott',
    receiverName: 'Dwight Schrute',
    pickupAddress: '1725 Slough Avenue, Scranton, PA',
    deliveryAddress: '88 Beet Farm Road, Honesdale, PA',
    parcelWeight: 15.0,
    parcelType: 'Heavy Freight',
    shippingDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-08',
    deliveryStatus: 'Pending',
    notes: 'Paper reams pallet'
  },
  {
    id: 'shp-104',
    trackingNumber: 'ST-661928',
    senderName: 'Sarah Connor',
    receiverName: 'John Connor',
    pickupAddress: '55 SkyNet Blvd, Austin, TX',
    deliveryAddress: '12 Cyberdyne Way, San Jose, CA',
    parcelWeight: 0.8,
    parcelType: 'Fragile Cargo',
    shippingDate: '2026-10-03',
    expectedDeliveryDate: '2026-10-07',
    deliveryStatus: 'Out for Delivery',
    notes: 'Microchip prototype'
  },
  {
    id: 'shp-105',
    trackingNumber: 'ST-554812',
    senderName: 'Bruce Wayne',
    receiverName: 'Alfred Pennyworth',
    pickupAddress: '1007 Mountain Drive, Gotham, NJ',
    deliveryAddress: 'Wayne Manor, Bristol, NJ',
    parcelWeight: 4.8,
    parcelType: 'Standard Parcel',
    shippingDate: '2026-10-02',
    expectedDeliveryDate: '2026-10-05',
    deliveryStatus: 'Picked Up',
    notes: 'Personal luggage'
  },
  {
    id: 'shp-106',
    trackingNumber: 'ST-443701',
    senderName: 'Tony Stark',
    receiverName: 'Pepper Potts',
    pickupAddress: '10880 Malibu Point, Malibu, CA',
    deliveryAddress: 'Stark Tower, New York, NY',
    parcelWeight: 22.4,
    parcelType: 'Heavy Freight',
    shippingDate: '2026-09-30',
    expectedDeliveryDate: '2026-10-04',
    deliveryStatus: 'Delivered',
    notes: 'Arc reactor parts'
  },
  {
    id: 'shp-107',
    trackingNumber: 'ST-332690',
    senderName: 'Peter Parker',
    receiverName: 'May Parker',
    pickupAddress: '20 Ingram Street, Forest Hills, NY',
    deliveryAddress: '177A Bleecker St, New York, NY',
    parcelWeight: 2.1,
    parcelType: 'Standard Parcel',
    shippingDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-09',
    deliveryStatus: 'Cancelled',
    notes: 'Photography equipment'
  },
  {
    id: 'shp-108',
    trackingNumber: 'ST-221589',
    senderName: 'Clark Kent',
    receiverName: 'Lois Lane',
    pickupAddress: '344 Clinton St, Metropolis, NY',
    deliveryAddress: 'Daily Planet Tower, Metropolis, NY',
    parcelWeight: 0.5,
    parcelType: 'Document Express',
    shippingDate: '2026-10-05',
    expectedDeliveryDate: '2026-10-07',
    deliveryStatus: 'Failed Delivery',
    notes: 'Investigative file'
  }
];

export const getShipments = async () => {
  const local = localStorage.getItem('courier_shipments');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error(e);
    }
  }

  // Otherwise initialize and simulate API call with Axios fetch to DummyJSON
  try {
    await axios.get(`${DUMMY_API_URL}?limit=1`);
  } catch (e) {
    console.log('DummyJSON API offline, loading default shipments dataset');
  }

  localStorage.setItem('courier_shipments', JSON.stringify(INITIAL_SHIPMENTS));
  return INITIAL_SHIPMENTS;
};

export const saveShipments = (shipments) => {
  localStorage.setItem('courier_shipments', JSON.stringify(shipments));
};

export const generateTrackingNumber = () => {
  return `ST-${Math.floor(100000 + Math.random() * 900000)}`;
};
