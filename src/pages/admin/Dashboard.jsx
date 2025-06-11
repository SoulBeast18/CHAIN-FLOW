import { UsersIcon, ShieldCheckIcon, ChartPieIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const stats = [
    { name: 'Total Users', value: '120', icon: UsersIcon, change: '+12%', changeType: 'increase' },
    { name: 'Active Roles', value: '3', icon: ShieldCheckIcon, change: '0%', changeType: 'neutral' },
    { name: 'System Usage', value: '89%', icon: ChartPieIcon, change: '+4%', changeType: 'increase' },
    { name: 'Resources', value: '24/7', icon: CubeIcon, change: '+2%', changeType: 'increase' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
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
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">New user registered: <span className="font-medium text-gray-900">John Doe</span></p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime="2025-05-06">1 minute ago</time>
                      </div>
                    </div>
                  </div>
                </li>
                {/* Add more activity items as needed */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}