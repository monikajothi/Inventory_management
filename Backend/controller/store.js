const Store = require("../models/store");

const addStore = async (req, res) => {
  const newStore = new Store({
    userID: req.body.userId,
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    city: req.body.city,
    image: req.body.image,
  });

  newStore.save()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
};

const getAllStores = async (req, res) => {
  const stores = await Store.find({ userID: req.params.userID }).sort({ _id: -1 });
  res.json(stores);
};

const deleteStore = async (req, res) => {
  const storeId = req.params.id;
  await Store.findByIdAndDelete(storeId);
  res.status(200).json({ message: "Store deleted successfully" });
};

module.exports = { addStore, getAllStores, deleteStore };
