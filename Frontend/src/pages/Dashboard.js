import React, { useContext, useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
      },
      yaxis: {
        logarithmic: true,
        title: {
          text: "Sales Amount",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          colors: ["#000"],
        },
        offsetY: -10,
        formatter: function (val) {
          return val.toLocaleString();
        },
        textAnchor: "middle",
        dropShadow: {
          enabled: false,
        },
        rotate: -90,
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [0, 15600, 0, 10215600, 55000, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });

  const authContext = useContext(AuthContext);

  const fetchTotalSaleAmount = useCallback(() => {
    fetch(
      `https://inventory-management-s29k.onrender.com/api/sales/get/${authContext.user}/totalsaleamount`
    )
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas?.totalSaleAmount || 0));
  }, [authContext.user]);

  const fetchTotalPurchaseAmount = useCallback(() => {
    fetch(
      `https://inventory-management-s29k.onrender.com/api/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas?.totalPurchaseAmount || 0));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`https://inventory-management-s29k.onrender.com/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas || []));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`https://inventory-management-s29k.onrender.com/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas || []))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchMonthlySalesData = useCallback(() => {
    fetch(`https://inventory-management-s29k.onrender.com/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!authContext?.user) return;

    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, [
    authContext,
    fetchTotalSaleAmount,
    fetchTotalPurchaseAmount,
    fetchStoresData,
    fetchProductsData,
    fetchMonthlySalesData,
  ]);

  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
        <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <span className="text-xs font-medium"> 67.81% </span>
          </div>
          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales
            </strong>
            <p>
              <span className="text-2xl font-medium text-gray-900">
                Rs.{saleAmount}
              </span>
              <span className="text-xs text-gray-500"> from Rs.1000 </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchase
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                Rs.{purchaseAmount}{" "}
              </span>

              <span className="text-xs text-gray-500"> from Rs.5000 </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {products.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from $404.32 </span> */}
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-small"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Stores
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {stores.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from 0 </span> */}
            </p>
          </div>
        </article>
        <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
          <div>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="700"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
