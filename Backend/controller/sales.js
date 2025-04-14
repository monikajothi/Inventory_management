const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    productName: req.body.productName,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productName, req.body.stockSold); // optional, only if this is how your soldStock works
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  try {
    const data = await Sales.find({ userID: req.params.userID })
      .sort({ _id: -1 })
      .populate("StoreID"); // populate only store since productName is a string now
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching sales data." });
  }
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  try {
    const salesData = await Sales.find({ userID: req.params.userID });
    const totalSaleAmount = salesData.reduce((sum, sale) => sum + sale.TotalSaleAmount, 0);
    res.json({ totalSaleAmount });
  } catch (err) {
    res.status(500).json({ error: "Error calculating total sales amount." });
  }
};

// Get monthly sales
const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    const salesAmount = Array(12).fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addSales, getSalesData, getTotalSalesAmount, getMonthlySales };
