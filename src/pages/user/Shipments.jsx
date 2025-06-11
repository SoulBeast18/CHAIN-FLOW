import { useState, useEffect } from 'react';
import {
  TruckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ChevronDownIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Shipments() {
  const [shipments, setShipments] = useState([
    {
      id: 'SHP001',
      orderNumber: 'ORD-2025-001',
      origin: 'New York, USA',
      destination: 'London, UK',
      status: 'in_transit',
      estimatedDelivery: '2025-05-15',
      carrier: 'Global Express',
      trackingNumber: 'GE789456123',
      items: [
        { name: 'Electronics', quantity: 50 },
        { name: 'Accessories', quantity: 100 }
      ],
      lastUpdated: '2025-05-08T10:30:00Z'
    },
    {
      id: 'SHP002',
      orderNumber: 'ORD-2025-002',
      origin: 'Shanghai, China',
      destination: 'San Francisco, USA',
      status: 'pending',
      estimatedDelivery: '2025-05-20',
      carrier: 'Pacific Logistics',
      trackingNumber: 'PL987654321',
      items: [
        { name: 'Raw Materials', quantity: 1000 },
        { name: 'Components', quantity: 500 }
      ],
      lastUpdated: '2025-05-08T09:15:00Z'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusMap = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    in_transit: { label: 'In Transit', color: 'bg-blue-100 text-blue-800' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
    delayed: { label: 'Delayed', color: 'bg-red-100 text-red-800' }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesSearch = 
      searchQuery === '' ||
      shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddShipment = (newShipment) => {
    setShipments([...shipments, {
      id: 'SHP' + (shipments.length + 1).toString().padStart(3, '0'),
      ...newShipment,
      lastUpdated: new Date().toISOString()
    }]);
    setShowAddModal(false);
  };

  const handleUpdateStatus = (shipmentId, newStatus) => {
    setShipments(shipments.map(shipment => 
      shipment.id === shipmentId 
        ? { ...shipment, status: newStatus, lastUpdated: new Date().toISOString() }
        : shipment
    ));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Shipments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage all shipments across your supply chain
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search by order #, tracking # or destination"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            {Object.entries(statusMap).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Order Details
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Route
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Carrier
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Est. Delivery
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.trackingNumber}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {shipment.origin} → {shipment.destination}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusMap[shipment.status].color}`}>
                          {statusMap[shipment.status].label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {shipment.carrier}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {shipment.estimatedDelivery}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Shipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Shipment
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddShipment({
                orderNumber: formData.get('orderNumber'),
                origin: formData.get('origin'),
                destination: formData.get('destination'),
                carrier: formData.get('carrier'),
                estimatedDelivery: formData.get('estimatedDelivery'),
                trackingNumber: formData.get('trackingNumber'),
                status: 'pending',
                items: [],
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Order Number
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Carrier
                  </label>
                  <input
                    type="text"
                    name="carrier"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    name="estimatedDelivery"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shipment Details Modal */}
      {showDetailsModal && selectedShipment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">
                Shipment Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Order Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedShipment.orderNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tracking Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedShipment.trackingNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Origin
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedShipment.origin}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Destination
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedShipment.destination}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <select
                  value={selectedShipment.status}
                  onChange={(e) => handleUpdateStatus(selectedShipment.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {Object.entries(statusMap).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Items
                </label>
                <div className="mt-1 bg-gray-50 rounded-md p-4">
                  {selectedShipment.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-500">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Last updated: {new Date(selectedShipment.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}