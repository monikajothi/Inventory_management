import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [totalInventoryValue, setTotalInventoryValue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState(0);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchAllData();
  }, [updatePage]);

  const fetchAllData = async () => {
    try {
      const [productRes, storeRes, salesRes, purchaseRes] = await Promise.all([
        fetch(`https://inventory-management-s29k.onrender.com/api/product/get/${authContext.user}`),
        fetch(`https://inventory-management-s29k.onrender.com/api/store/get/${authContext.user}`),
        fetch(`https://inventory-management-s29k.onrender.com/api/sales/get/${authContext.user}`),
        fetch(`https://inventory-management-s29k.onrender.com/api/purchase/get/${authContext.user}`),
      ]);

      const productData = await productRes.json();
      const storeData = await storeRes.json();
      const salesData = await salesRes.json();
      const purchaseData = await purchaseRes.json();

      setAllProducts(productData);
      setAllStores(storeData);
      setSales(salesData);
      setPurchases(purchaseData);

      calculateInventoryMetrics(productData, salesData, purchaseData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const calculateInventoryMetrics = (products, sales, purchases) => {
    let inventoryValue = 0;
    let revenue = 0;
    let stockAlert = 0;
    const productSalesMap = {};

    purchases.forEach((item) => {
      inventoryValue += (item.purchasePrice || 0) * (item.quantity || 0);
    });

    sales.forEach((item) => {
      revenue += (item.sellingPrice || 0) * (item.quantity || 0);
      if (item.productId) {
        productSalesMap[item.productId] = (productSalesMap[item.productId] || 0) + item.quantity;
      }
    });

    products.forEach((item) => {
      if ((item.stock || 0) <= 5) stockAlert++;
    });

    const topProducts = Object.entries(productSalesMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => id);

    setTotalInventoryValue(inventoryValue);
    setTotalRevenue(revenue);
    setTopSellingProducts(topProducts);
    setLowStockProducts(stockAlert);
  };

  const addProductModalSetting = () => setShowProductModal(!showProductModal);

  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    fetch(`https://inventory-management-s29k.onrender.com/api/product/delete/${id}`)
      .then((response) => response.json())
      .then(() => setUpdatePage(!updatePage));
  };

  const handlePageUpdate = () => setUpdatePage(!updatePage);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetch(
      `https://inventory-management-s29k.onrender.com/api/product/search?searchTerm=${e.target.value}`
    )
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {/* Overview Cards */}
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex flex-col p-10 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-gray-600 text-base">
                {products.length}
              </span>
              <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
            </div>

            {/* <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">Stores</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {stores.length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    ₹{totalRevenue}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Revenue</span>
                </div>
              </div>
            </div> */}

            {/* <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">Top Selling</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {topSellingProducts.length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    ₹{totalInventoryValue}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Stock Value</span>
                </div>
              </div>
            </div> */}

            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">Low Stocks</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {lowStockProducts}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Alert Products</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {products.filter((p) => p.stock === 0).length}
                  </span>
                  <span className="font-thin text-gray-400 text-xs">Out of Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        {/* Product Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Products</span>
              <div className="flex items-center px-2 border-2 rounded-md">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={addProductModalSetting}
            >
              Add Product
            </button>
          </div>

          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Products</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Manufacturer</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Stock</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">Availability</th>
                <th className="px-4 py-2 text-left font-medium text-gray-900">More</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2 text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 text-gray-700">{product.manufacturer}</td>
                  <td className="px-4 py-2 text-gray-700">{product.stock}</td>
                  <td className="px-4 py-2 text-gray-700">{product.description}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {product.stock > 0 ? "In Stock" : "Not in Stock"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    <span
                      className="text-green-700 cursor-pointer"
                      onClick={() => updateProductModalSetting(product)}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-600 px-2 cursor-pointer"
                      onClick={() => deleteItem(product._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
