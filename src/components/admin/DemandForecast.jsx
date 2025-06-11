import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DemandForecast() {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);

  // Sample products (in a real app, this would come from your database)
  const products = [
    { id: 'all', name: 'All Products' },
    { id: 'prod1', name: 'Electronics' },
    { id: 'prod2', name: 'Apparel' },
    { id: 'prod3', name: 'Home Goods' }
  ];

  // Sample historical data (in a real app, this would come from your API)
  const sampleData = {
    all: [120, 132, 145, 140, 158, 165, 172, 168, 175, 182, 190, 188],
    prod1: [45, 48, 52, 50, 55, 58, 60, 57, 59, 62, 65, 63],
    prod2: [35, 38, 42, 40, 45, 47, 50, 48, 52, 54, 56, 55],
    prod3: [40, 46, 51, 50, 58, 60, 62, 63, 64, 66, 69, 70]
  };

  // Initialize or load the ML model
  useEffect(() => {
    createModel();
  }, []);

  // Create and train the model when product selection changes
  useEffect(() => {
    if (model) {
      trainModel();
    }
  }, [selectedProduct, model]);

  const createModel = async () => {
    // Create a simple sequential model
    const newModel = tf.sequential({
      layers: [
        tf.layers.dense({ units: 8, inputShape: [6], activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });

    newModel.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    setModel(newModel);
  };

  const preprocessData = (data) => {
    const result = [];
    for (let i = 6; i < data.length; i++) {
      const sequence = data.slice(i - 6, i);
      result.push({
        input: sequence,
        output: data[i]
      });
    }
    return result;
  };

  const trainModel = async () => {
    if (!model) return;

    setIsLoading(true);
    try {
      const data = sampleData[selectedProduct];
      setHistoricalData(data);

      const processedData = preprocessData(data);
      
      const xs = tf.tensor2d(processedData.map(d => d.input));
      const ys = tf.tensor2d(processedData.map(d => [d.output]));

      await model.fit(xs, ys, {
        epochs: 100,
        batchSize: 4,
        shuffle: true
      });

      // Make predictions for the next 6 months
      const lastSequence = data.slice(-6);
      let nextPredictions = [];

      for (let i = 0; i < 6; i++) {
        const input = tf.tensor2d([lastSequence.slice(-6)]);
        const prediction = model.predict(input);
        const predictedValue = await prediction.data();
        nextPredictions.push(Math.round(predictedValue[0]));
        lastSequence.push(predictedValue[0]);
      }

      setPredictions(nextPredictions);
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'Jan*', 'Feb*', 'Mar*', 'Apr*', 'May*', 'Jun*'
    ],
    datasets: [
      {
        label: 'Historical Data',
        data: historicalData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predictions',
        data: [...Array(12).fill(null), ...predictions],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Demand Forecast Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Units'
        }
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          AI-Powered Demand Forecast
        </h2>
        <p className="text-gray-600 mb-4">
          View historical data and AI-generated predictions for the next 6 months
        </p>
        
        {/* Product Selection */}
        <div className="mb-6">
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
            Select Product Category
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Training AI model...</span>
          </div>
        )}

        {/* Chart */}
        <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Insights Panel */}
        {!isLoading && predictions.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Key Insights</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Predicted growth over next 6 months: {Math.round(((predictions[5] - historicalData[historicalData.length - 1]) / historicalData[historicalData.length - 1]) * 100)}%</li>
              <li>• Highest predicted demand: {Math.max(...predictions)} units</li>
              <li>• Lowest predicted demand: {Math.min(...predictions)} units</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}