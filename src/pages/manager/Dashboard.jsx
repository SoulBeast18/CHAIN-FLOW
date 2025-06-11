import { 
  CubeIcon, 
  TruckIcon, 
  UserGroupIcon, 
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
  const stats = [
    { 
      name: 'Active Suppliers', 
      value: '45', 
      icon: UserGroupIcon, 
      change: '+5%',
      changeType: 'increase'
    },
    { 
      name: 'Pending Shipments', 
      value: '28', 
      icon: TruckIcon, 
      change: '+12%',
      changeType: 'increase'
    },
    { 
      name: 'Monthly Reports', 
      value: '15', 
      icon: DocumentDuplicateIcon, 
      change: '0%',
      changeType: 'neutral'
    },
  ];

  const alerts = [
    {
      title: 'Low Stock Alert',
      description: 'Item #1234 - Steel Components running low',
      type: 'warning',
      timestamp: '2 hours ago'
    },
    {
      title: 'Delayed Shipment',
      description: 'Shipment #789 delayed by 2 days',
      type: 'alert',
      timestamp: '4 hours ago'
    },
    {
      title: 'New Supplier Approval',
      description: 'New supplier registration pending approval',
      type: 'info',
      timestamp: '1 day ago'
    }
  ];

  const recentActivities = [
    {
      action: 'Shipment Delivered',
      details: 'Order #12345 delivered to warehouse',
      timestamp: '30 minutes ago',
      icon: TruckIcon
    },
    {
      action: 'Inventory Updated',
      details: 'Stock levels adjusted for 15 items',
      timestamp: '2 hours ago',
      icon: CubeIcon
    },
    {
      action: 'New Supplier Added',
      details: 'Tech Solutions Inc. added to supplier list',
      timestamp: '5 hours ago',
      icon: UserGroupIcon
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manager Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of supply chain operations and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-green-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase' ? 'text-green-600' : 
                  item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : item.changeType === 'decrease' ? (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                ) : null}
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Link
          to="/manager/forecast"
          className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChartPieIcon className="h-8 w-8 text-white" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-white">AI-Powered Demand Forecast</h2>
                  <p className="text-blue-100">
                    View predictions and insights for future inventory requirements
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">+15%</p>
                <p className="text-blue-100">Predicted Growth</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="/manager/suppliers"
          className="block bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
        >
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-white" />
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-white">Supplier Portal</h2>
                  <p className="text-green-100">
                    Manage suppliers, track orders, and conduct quality checks
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">45</p>
                <p className="text-green-100">Active Suppliers</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon 
                      className={`h-6 w-6 ${
                        alert.type === 'warning' ? 'text-yellow-500' :
                        alert.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                      }`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {recentActivities.map((activity, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== recentActivities.length - 1 && (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                            <activity.icon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.details}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time dateTime={activity.timestamp}>{activity.timestamp}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}