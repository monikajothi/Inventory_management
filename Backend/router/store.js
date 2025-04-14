const express = require("express");
const router = express.Router();
const store = require("../controller/store");

router.post("/add", store.addStore);
router.get("/get/:userID", store.getAllStores);
router.delete("/delete/:id", async (req, res) => {
  try {
    await store.deleteStore(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error deleting store" });
  }
});

module.exports = router;
