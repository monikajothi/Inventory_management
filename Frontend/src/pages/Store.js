import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`https://inventory-management-5d02.onrender.com/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12 border-2">
        <div className="flex justify-between">
          <span className="font-bold">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
            onClick={() => setShowModal(true)}
          >
            Add Store
          </button>
        </div>

        {showModal && (
          <AddStore
            onClose={() => setShowModal(false)}
            onStoreAdded={fetchData}
          />
        )}

        {stores.map((store) => (
          <div key={store._id} className="bg-white w-50 h-fit flex flex-col gap-4 p-4">
           
            <div className="flex flex-col gap-3 justify-between items-start">
              <span className="font-bold">{store.name}</span>
              <div className="flex">
                <img
                  alt="location-icon"
                  className="h-6 w-6"
                  src={require("../assets/location-icon.png")}
                />
                <span>{store.address + ", " + store.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
