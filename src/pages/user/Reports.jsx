import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  ChartBarIcon, 
  TableCellsIcon, 
  ListBulletIcon,
  PresentationChartLineIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

// Chart.js configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Available report widgets
const availableWidgets = [
  {
    id: 'sales-chart',
    type: 'chart',
    title: 'Sales Overview',
    icon: ChartBarIcon,
    description: 'Line chart showing sales trends'
  },
  {
    id: 'inventory-table',
    type: 'table',
    title: 'Inventory Status',
    icon: TableCellsIcon,
    description: 'Current inventory levels'
  },
  {
    id: 'orders-list',
    type: 'list',
    title: 'Recent Orders',
    icon: ListBulletIcon,
    description: 'List of recent orders'
  },
  {
    id: 'performance-metrics',
    type: 'metrics',
    title: 'Performance Metrics',
    icon: PresentationChartLineIcon,
    description: 'Key performance indicators'
  },
  {
    id: 'supplier-performance',
    type: 'supplier-metrics',
    title: 'Supplier Performance Analysis',
    icon: ChartBarIcon,
    description: 'Supplier performance metrics and charts'
  },
  {
    id: 'inventory-analysis',
    type: 'inventory-metrics',
    title: 'Inventory Analysis Dashboard',
    icon: TableCellsIcon,
    description: 'Detailed inventory metrics and trends'
  },
  {
    id: 'shipment-analytics',
    type: 'shipment-metrics',
    title: 'Shipment Performance Metrics',
    icon: PresentationChartLineIcon,
    description: 'Shipment analytics and trends'
  }
];

const generateInsights = (type, data) => {
  switch (type) {
    case 'supplier-metrics':
      const avgDelivery = data.suppliers.reduce((acc, s) => acc + s.onTimeDelivery, 0) / data.suppliers.length;
      const avgQuality = data.suppliers.reduce((acc, s) => acc + s.qualityScore, 0) / data.suppliers.length;
      const bestSupplier = data.suppliers.reduce((a, b) => a.qualityScore > b.qualityScore ? a : b);
      const worstDelivery = data.suppliers.reduce((a, b) => a.onTimeDelivery < b.onTimeDelivery ? a : b);
      
      return {
        analysis: `Overall supplier performance shows an average on-time delivery rate of ${avgDelivery.toFixed(1)}% and quality score of ${avgQuality.toFixed(1)}%.`,
        prediction: `Based on current trends, we predict ${bestSupplier.supplier} will maintain top performance, while ${worstDelivery.supplier} needs attention for delivery improvements.`,
        recommendations: [
          'Schedule quarterly performance reviews with low-performing suppliers',
          'Implement early warning system for delayed deliveries',
          'Consider dual-sourcing for critical components'
        ]
      };

    case 'inventory-metrics':
      const totalCost = data.inventory.reduce((acc, item) => acc + item.holdingCost, 0);
      const highTurnover = data.inventory.reduce((a, b) => a.turnoverRate > b.turnoverRate ? a : b);
      const highStockout = data.inventory.reduce((a, b) => a.stockoutRate > b.stockoutRate ? a : b);

      return {
        analysis: `Total holding cost is $${totalCost.toLocaleString()}. ${highTurnover.category} shows highest turnover rate at ${highTurnover.turnoverRate}x.`,
        prediction: `${highStockout.category} has high stockout risk (${highStockout.stockoutRate}%). Consider increasing safety stock by 20%.`,
        recommendations: [
          'Optimize reorder points for high-stockout categories',
          'Review storage costs for slow-moving items',
          'Implement ABC analysis for inventory prioritization'
        ]
      };

    case 'shipment-metrics':
      const totalShipments = data.shipments.reduce((acc, month) => acc + month.onTime + month.delayed + month.cancelled, 0);
      const delayRate = data.shipments.reduce((acc, month) => acc + month.delayed, 0) / totalShipments * 100;
      const deliveryTrend = data.shipments[2].onTime > data.shipments[0].onTime ? 'improving' : 'declining';

      return {
        analysis: `Overall delivery performance is ${(100 - delayRate).toFixed(1)}% with a ${deliveryTrend} trend.`,
        prediction: `Based on current patterns, we expect a ${deliveryTrend === 'improving' ? 'continued improvement' : 'potential decline'} in on-time deliveries next month.`,
        recommendations: [
          'Focus on reducing cancellation rates through better planning',
          'Implement real-time tracking for all shipments',
          'Review carrier performance and routes for delayed shipments'
        ]
      };

    case 'chart':
      const values = data.datasets[0].data;
      const salesTrend = values[values.length - 1] > values[0] ? 'upward' : 'downward';
      const avg = values.reduce((a, b) => a + b) / values.length;
      
      return {
        analysis: `Sales show a ${salesTrend} trend with average value of ${avg.toLocaleString()}.`,
        prediction: `Based on the ${salesTrend} trend, we project continued growth in the next quarter.`,
        recommendations: [
          'Monitor seasonal patterns for inventory planning',
          'Adjust stock levels based on sales velocity',
          'Review pricing strategy for optimal performance'
        ]
      };

    default:
      return null;
  }
};

export default function Reports() {
  const [widgets, setWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const reportCanvasRef = useRef(null);

  // Sample data generation
  const generateChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: Array.from({ length: 6 }, () => faker.number.int({ min: 1000, max: 5000 })),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });

  const generateTableData = () => Array.from({ length: 5 }, () => ({
    id: faker.string.alphanumeric(6),
    product: faker.commerce.productName(),
    quantity: faker.number.int({ min: 10, max: 1000 }),
    status: faker.helpers.arrayElement(['In Stock', 'Low Stock', 'Out of Stock'])
  }));

  const generateOrdersData = () => Array.from({ length: 5 }, () => ({
    id: faker.string.alphanumeric(8),
    customer: faker.company.name(),
    amount: faker.finance.amount(),
    date: faker.date.recent().toLocaleDateString()
  }));

  const generateSupplierData = () => ({
    suppliers: [
      { supplier: "Supplier A", onTimeDelivery: 95, qualityScore: 98, responseTime: 24 },
      { supplier: "Supplier B", onTimeDelivery: 88, qualityScore: 92, responseTime: 36 },
      { supplier: "Supplier C", onTimeDelivery: 92, qualityScore: 95, responseTime: 12 }
    ],
    chartData: {
      labels: ["Supplier A", "Supplier B", "Supplier C"],
      datasets: [
        {
          label: 'On-Time Delivery %',
          data: [95, 88, 92],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Quality Score',
          data: [98, 92, 95],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
        }
      ]
    }
  });

  const generateInventoryData = () => ({
    inventory: [
      { category: "Raw Materials", turnoverRate: 12, stockoutRate: 0.5, holdingCost: 25000 },
      { category: "WIP", turnoverRate: 24, stockoutRate: 0.2, holdingCost: 15000 },
      { category: "Finished Goods", turnoverRate: 15, stockoutRate: 0.8, holdingCost: 35000 }
    ],
    chartData: {
      labels: ["Raw Materials", "WIP", "Finished Goods"],
      datasets: [{
        label: 'Holding Cost ($)',
        data: [25000, 15000, 35000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ]
      }]
    }
  });

  const generateShipmentData = () => ({
    shipments: [
      { month: "January", onTime: 156, delayed: 14, cancelled: 3 },
      { month: "February", onTime: 142, delayed: 18, cancelled: 2 },
      { month: "March", onTime: 168, delayed: 12, cancelled: 1 }
    ],
    chartData: {
      labels: ["January", "February", "March"],
      datasets: [
        {
          label: 'On-Time Deliveries',
          data: [156, 142, 168],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Delayed',
          data: [14, 18, 12],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    }
  });

  const addWidget = (widget) => {
    const newWidget = {
      ...widget,
      instanceId: `${widget.id}-${Date.now()}`,
      data: widget.type === 'chart' ? generateChartData() :
            widget.type === 'table' ? generateTableData() :
            widget.type === 'list' ? generateOrdersData() :
            widget.type === 'supplier-metrics' ? generateSupplierData() :
            widget.type === 'inventory-metrics' ? generateInventoryData() :
            widget.type === 'shipment-metrics' ? generateShipmentData() :
            null
    };
    setWidgets([...widgets, newWidget]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'available-widgets' && destination.droppableId === 'report-canvas') {
      const widget = availableWidgets.find(w => w.id === result.draggableId);
      if (widget) {
        addWidget(widget);
      }
    } else if (source.droppableId === 'report-canvas' && destination.droppableId === 'report-canvas') {
      const items = Array.from(widgets);
      const [removed] = items.splice(source.index, 1);
      items.splice(destination.index, 0, removed);
      setWidgets(items);
    }
  };

  const removeWidget = (instanceId) => {
    setWidgets(widgets.filter(w => w.instanceId !== instanceId));
  };

  const customizeWidget = (widget) => {
    setSelectedWidget(widget);
    setShowCustomizeModal(true);
  };

  const renderInsights = (widget) => {
    const insights = generateInsights(widget.type, widget.data);
    if (!insights) return null;

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900">AI Analysis</h4>
            <p className="mt-1 text-sm text-gray-600">{insights.analysis}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Forecast & Predictions</h4>
            <p className="mt-1 text-sm text-gray-600">{insights.prediction}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
            <ul className="mt-1 space-y-1">
              {insights.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'chart':
        return (
          <div>
            <div className="h-64">
              <Line data={widget.data} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: widget.title } }
              }} />
            </div>
            {renderInsights(widget)}
          </div>
        );
      
      case 'supplier-metrics':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time Delivery %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time (hrs)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {widget.data.suppliers.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.onTimeDelivery}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.qualityScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-64">
              <Bar data={widget.data.chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Supplier Performance Metrics' } }
              }} />
            </div>
            {renderInsights(widget)}
          </div>
        );

      case 'inventory-metrics':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turnover Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stockout Rate %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holding Cost ($)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {widget.data.inventory.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.turnoverRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockoutRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.holdingCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-64">
              <Pie data={widget.data.chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Inventory Cost Distribution' } }
              }} />
            </div>
            {renderInsights(widget)}
          </div>
        );

      case 'shipment-metrics':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delayed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {widget.data.shipments.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.onTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.delayed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-64">
              <Bar data={widget.data.chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Monthly Shipment Performance' } }
              }} />
            </div>
            {renderInsights(widget)}
          </div>
        );

      default:
        return null;
    }
  };

  const exportReport = async () => {
    if (!reportCanvasRef.current || widgets.length === 0) {
      alert('No widgets to export!');
      return;
    }

    try {
      // Show loading state
      const exportButton = document.querySelector('#export-button');
      const originalText = exportButton.innerHTML;
      exportButton.innerHTML = '<span class="animate-spin">↻</span> Generating PDF...';
      exportButton.disabled = true;

      // Create PDF
      const canvas = await html2canvas(reportCanvasRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm
      let heightLeft = imgHeight;
      let position = 0;

      // Add title
      pdf.setFontSize(16);
      pdf.text('Supply Chain Analytics Report', 105, 15, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(new Date().toLocaleString(), 105, 22, { align: 'center' });
      position = 30;

      // Add image
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - position);

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('supply-chain-report.pdf');

      // Reset button state
      exportButton.innerHTML = originalText;
      exportButton.disabled = false;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Report Builder</h1>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop widgets to create custom reports
            </p>
          </div>
          <button
            id="export-button"
            onClick={exportReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6">
            {/* Sidebar with available widgets */}
            <div className="w-64 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Available Widgets</h2>
              <div className="space-y-2">
                {availableWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => addWidget(widget)}
                  >
                    <div className="flex items-center">
                      <widget.icon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{widget.title}</p>
                        <p className="text-xs text-gray-500">{widget.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report canvas */}
            <div className="flex-1">
              <div 
                ref={reportCanvasRef}
                className="bg-white rounded-lg shadow min-h-[600px] p-6"
              >
                {widgets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-8">
                    <p className="text-lg mb-4">No widgets added yet</p>
                    <p className="text-sm text-center">Click on widgets from the sidebar to add them to your report</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {widgets.map((widget, index) => (
                      <div
                        key={widget.instanceId}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center">
                            <widget.icon className="h-5 w-5 text-gray-400 mr-2" />
                            <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => customizeWidget(widget)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <AdjustmentsHorizontalIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => removeWidget(widget.instanceId)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          {renderWidget(widget)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DragDropContext>

        {/* Customize Widget Modal */}
        {showCustomizeModal && selectedWidget && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customize Widget</h3>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Customization options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Widget Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedWidget.title}
                    onChange={(e) => {
                      const updatedWidgets = widgets.map(w =>
                        w.instanceId === selectedWidget.instanceId
                          ? { ...w, title: e.target.value }
                          : w
                      );
                      setWidgets(updatedWidgets);
                      setSelectedWidget({ ...selectedWidget, title: e.target.value });
                    }}
                  />
                </div>

                {/* Add more customization options based on widget type */}
                {selectedWidget.type === 'chart' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chart Type</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option>Line Chart</option>
                      <option>Bar Chart</option>
                      <option>Pie Chart</option>
                    </select>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}