import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [activeTab, setActiveTab] = useState('sales');
  const [topProducts, setTopProducts] = useState([]);
  const [productTrend, setProductTrend] = useState(null);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [daysAhead, setDaysAhead] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchStoresData();
    fetchProductsData();
  }, [updatePage]);

  const fetchSalesData = () => {
    fetch(`https://inventory-management-s29k.onrender.com/api/sales/get/${authContext.user?._id}`)
      .then((response) => response.json())
      .then((data) => setAllSalesData(data))
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`https://inventory-management-s29k.onrender.com/api/product/get/${authContext.user?._id}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        if (data.length > 0) setSelectedProduct(data[0].productName);
      })
      .catch((err) => console.log(err));
  };

  const fetchStoresData = () => {
    fetch(`https://inventory-management-s29k.onrender.com/api/store/get/${authContext.user?._id}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
        if (data.length > 0) setSelectedStore(data[0]._id);
      })
      .catch((err) => console.log(err));
  };

const fetchTopProducts = async () => {
  if (!selectedStore) return;
  setLoading(true);
  setError('');
  try {
    const response = await fetch(
      `https://inventory-management-2-gvbw.onrender.com/predict/top-products?store_id=${selectedStore}&date=${new Date().toISOString().split('T')[0]}&top_n=5`
    );
    if (!response.ok) throw new Error('Failed to fetch predictions');
    const data = await response.json();
    setTopProducts(data.predictions || []);
  } catch (error) {
    console.error('Prediction error:', error);
    setError('Failed to load predictions. Please try again.');
  } finally {
    setLoading(false);
  }
};
const fetchProductTrend = async () => {
  if (!selectedStore || !selectedProduct) return;
  setLoading(true);
  setError('');
  try {
    const response = await fetch(
      `https://inventory-management-2-gvbw.onrender.com/predict/product-trend?product_name=${selectedProduct}&store_id=${selectedStore}&start_date=${new Date().toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch trend');
    const data = await response.json();
    setProductTrend(data);
  } catch (error) {
    console.error('Trend error:', error);
    setError('Failed to load sales trend. Please try again.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (activeTab === 'predictions' && selectedStore) {
      fetchTopProducts();
      if (selectedProduct) fetchProductTrend();
    }
  }, [selectedStore, selectedProduct, daysAhead, activeTab]);

const topProductsChartData = {
  labels: topProducts.map(item => item.product), 
  datasets: [{
    label: 'Predicted Sales (units)',
    data: topProducts.map(item => item.predicted_sales),
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
  }],
};

  const productTrendChartData = productTrend ? {
    labels: productTrend.trendData?.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: [{
      label: `Predicted Sales for ${productTrend.productName}`,
      data: productTrend.trendData?.map(item => item.sales) || [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true,
    }],
  } : null;

  const addSaleModalSetting = () => setShowSaleModal(!showSaleModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'sales' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales Records
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'predictions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('predictions')}
          >
            Sales Predictions
          </button>
        </div>

        {activeTab === 'sales' ? (
          <>
            {showSaleModal && (
              <AddSale
                addSaleModalSetting={addSaleModalSetting}
                products={products}
                stores={stores}
                handlePageUpdate={handlePageUpdate}
                authContext={authContext}
              />
            )}
            <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
              <div className="flex justify-between pt-5 pb-3 px-3">
                <div className="flex gap-4 justify-center items-center">
                  <span className="font-bold">Sales</span>
                </div>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                    onClick={addSaleModalSetting}
                  >
                    Add Sales
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Product Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Store Name
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Stock Sold
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Sales Date
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Total Sale Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sales.map((element, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                        {element.productName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {element.StoreID?.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {element.StockSold}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        {element.SaleDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                        Rs.{element.TotalSaleAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Sales Predictions</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Store</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={stores.length === 0}
                >
                  {stores.length === 0 ? (
                    <option>Loading stores...</option>
                  ) : (
                    stores.map(store => (
                      <option key={store._id} value={store._id}>
                        {store.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              
            </div>

            {loading ? (
              <div className="text-center py-4">Loading predictions...</div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Top Predicted Products</h3>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-64">
                    {topProducts.length > 0 ? (
                      <Bar
                        data={topProductsChartData}
                        options={{
                          responsive: true,
                          plugins: {
                            title: {
                              display: true,
                              text: `Top Products for Next ${daysAhead} Days`,
                            },
                          },
                        }}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {stores.length === 0 
                          ? "No stores available" 
                          : "No prediction data available for selected store"}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;