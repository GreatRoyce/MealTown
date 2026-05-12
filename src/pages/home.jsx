import React, { useEffect, useState } from "react";
import fooditems from "../data/fooditems";
import axios from "axios";

function Home() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/vendors/get-all-vendors")
      .then((response) => {
        console.log("Vendors response:", response.data);
        // Make sure response.data.data exists before setting state
        if (response.data && response.data.data) {
          setVendors(response.data.data);
        } else {
          setVendors([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setError("Failed to fetch vendors. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => 
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter food items based on search term
  const filteredFoodItems = fooditems.filter(food =>
    food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.restaurant?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pt-7 bg-gray-100 min-h-screen text-center capitalize w-full">
      <p className="text-xl font-bold">Welcome to MealTown</p>
      <p className="text-gray-600">Discover amazing restaurants and delicious food</p>

      {/* Search bar */}
      <div className="w-full max-w-md mx-auto bg-white relative rounded-lg shadow-sm">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          placeholder="Search restaurants or food..."
          className="w-full pl-10 pr-3 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-full overflow-hidden w-full max-w-md mx-auto p-1">
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`flex-1 text-center py-3 font-medium rounded-full transition-all duration-200 ${
            activeTab === "restaurants"
              ? "bg-white shadow text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab("food")}
          className={`flex-1 text-center py-3 font-medium rounded-full transition-all duration-200 ${
            activeTab === "food"
              ? "bg-white shadow text-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Food Items
        </button>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 lg:px-8 w-full">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-10">{error}</div>
        ) : (
          <>
            {activeTab === "restaurants" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={vendor.logo || "https://via.placeholder.com/300"}
                          alt={vendor.businessName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex flex-col text-left">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-lg font-semibold truncate">{vendor.businessName}</h2>
                          {vendor.isVerified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 truncate">{vendor.businessAddress}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          Phone: {vendor.businessPhone}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Hours: {vendor.openHour} – {vendor.closeHour}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                            {vendor.type}
                          </span>
                          {vendor.isPaused && (
                            <span className="text-xs text-red-600">⏸ Paused</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">
                      {searchTerm ? `No restaurants found for "${searchTerm}"` : "No restaurants available"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFoodItems.length > 0 ? (
                  filteredFoodItems.map((food) => (
                    <div
                      key={food.id}
                      className="bg-amber-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold truncate">{food.name}</h3>
                          <p className="text-lg text-green-700 font-bold">
                            ${food.price}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-600 line-clamp-2">{food.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{food.restaurant}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-3 py-1 bg-gray-200 rounded-full">
                            {food.category}
                          </span>
                          <button className="px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 transition-colors duration-200 text-sm">
                            + Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">
                      {searchTerm ? `No food items found for "${searchTerm}"` : "No food items available"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;