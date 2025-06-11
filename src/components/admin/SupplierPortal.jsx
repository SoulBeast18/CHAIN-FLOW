import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon, 
  TruckIcon, 
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

export default function SupplierPortal() {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderDetails, setReorderDetails] = useState({
    productId: '',
    quantity: 0,
    supplier: null,
    urgency: 'normal'
  });

  // Sample data for demonstration - in production, this would come from Firestore
  const sampleSuppliers = [
    {
      id: 'sup1',
      name: 'Tech Components Inc.',
      rating: 4.8,
      onTimeDelivery: '98%',
      qualityScore: '96%',
      status: 'active',
      products: ['Electronics', 'Semiconductors']
    },
    {
      id: 'sup2',
      name: 'Global Manufacturing Co.',
      rating: 4.5,
      onTimeDelivery: '95%',
      qualityScore: '94%',
      status: 'active',
      products: ['Hardware', 'Tools']
    }
  ];

  const sampleOrders = [
    {
      id: 'ord1',
      supplierId: 'sup1',
      product: 'Microcontrollers',
      quantity: 1000,
      status: 'in_transit',
      expectedDelivery: '2025-05-10',
      qualityCheck: 'pending'
    },
    {
      id: 'ord2',
      supplierId: 'sup2',
      product: 'Assembly Tools',
      quantity: 500,
      status: 'delivered',
      expectedDelivery: '2025-05-05',
      qualityCheck: 'passed'
    }
  ];

  useEffect(() => {
    // In a real app, this would be a Firestore subscription
    setSuppliers(sampleSuppliers);
    setOrders(sampleOrders);
  }, []);

  const handleQualityCheck = async (orderId, result) => {
    try {
      // In production, this would update Firestore
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, qualityCheck: result };
        }
        return order;
      });
      setOrders(updatedOrders);

      // Update quality metrics for the supplier
      const order = orders.find(o => o.id === orderId);
      const supplier = suppliers.find(s => s.id === order.supplierId);
      if (supplier) {
        const updatedSuppliers = suppliers.map(s => {
          if (s.id === supplier.id) {
            const newScore = result === 'passed' ? 
              parseFloat(s.qualityScore) + 0.1 : 
              parseFloat(s.qualityScore) - 0.1;
            return { 
              ...s, 
              qualityScore: Math.min(Math.max(newScore, 0), 100).toFixed(1) + '%'
            };
          }
          return s;
        });
        setSuppliers(updatedSuppliers);
      }
    } catch (error) {
      console.error('Error updating quality check:', error);
    }
  };

  const handleReorder = async () => {
    try {
      // In production, this would create a new order in Firestore
      const newOrder = {
        id: 'ord' + (orders.length + 1),
        supplierId: reorderDetails.supplier.id,
        product: reorderDetails.productId,
        quantity: reorderDetails.quantity,
        status: 'pending',
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        qualityCheck: 'pending',
        urgency: reorderDetails.urgency
      };

      setOrders([...orders, newOrder]);
      setShowReorderModal(false);
      setReorderDetails({
        productId: '',
        quantity: 0,
        supplier: null,
        urgency: 'normal'
      });
    } catch (error) {
      console.error('Error creating reorder:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_transit': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      case 'delayed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Supplier Portal</h2>
        <button
          onClick={() => setShowReorderModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          New Order
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div 
            key={supplier.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedSupplier(supplier)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">{supplier.products.join(', ')}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {supplier.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">On-time Delivery</p>
                <p className="text-lg font-semibold text-gray-900">{supplier.onTimeDelivery}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Score</p>
                <p className="text-lg font-semibold text-gray-900">{supplier.qualityScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Check
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {suppliers.find(s => s.id === order.supplierId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center ${getStatusColor(order.status)}`}>
                      <TruckIcon className="h-4 w-4 mr-1" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.expectedDelivery}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.qualityCheck === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleQualityCheck(order.id, 'passed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleQualityCheck(order.id, 'failed')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center ${
                        order.qualityCheck === 'passed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {order.qualityCheck === 'passed' ? (
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 mr-1" />
                        )}
                        {order.qualityCheck}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reorder Modal */}
      {showReorderModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Order</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleReorder(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reorderDetails.supplier?.id || ''}
                    onChange={(e) => setReorderDetails({
                      ...reorderDetails,
                      supplier: suppliers.find(s => s.id === e.target.value)
                    })}
                    required
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reorderDetails.productId}
                    onChange={(e) => setReorderDetails({
                      ...reorderDetails,
                      productId: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reorderDetails.quantity}
                    onChange={(e) => setReorderDetails({
                      ...reorderDetails,
                      quantity: parseInt(e.target.value)
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Urgency</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={reorderDetails.urgency}
                    onChange={(e) => setReorderDetails({
                      ...reorderDetails,
                      urgency: e.target.value
                    })}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReorderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}