import React, { useEffect, useState } from "react";
import { getStoredUser, getUserProfile } from "../utils/api";
import restaurants from "../data/restraurants";

function Profile() {
  const [profileInfo, setProfileInfo] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        const backendProfile = response?.data || null;
        if (backendProfile) {
          setProfileInfo((prev) => ({ ...prev, ...backendProfile }));
        }
      } catch (err) {
        setError(err?.message || "Could not load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="w-[80%] mx-auto py-8 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="w-[80%] mx-auto">
      {/* Header */}
      <p className="text-xl font-semibold capitalize py-6 border-b">
        My Profile
      </p>

      {/* Profile Information */}
      <div className="mt-6">
        <p className="capitalize text-lg font-medium pb-4">
          Profile Information
        </p>
        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-6 grid gap-4 grid-cols-2 text-sm border bg-slate-100 rounded-2xl px-6 py-6 shadow-sm hover:shadow-[1px_3px_3px_rgba(0,0,0,0.3)] overflow-hidden transition">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{profileInfo?.name || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{profileInfo?.email || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{profileInfo?.phone || "N/A"}</p>
          </div>

          <div>
            <p className="text-gray-500">Country</p>
            <p className="font-medium">{profileInfo?.country || "N/A"}</p>
          </div>

          <div className="flex items-center gap-3 pt-2 col-span-2">
            <p className="text-gray-500">Rider Status:</p>
            <span className="text-xs font-semibold text-gray-700 bg-slate-300 rounded-md px-2 py-1">
              Not a Rider
            </span>
            <button className="border border-gray-400 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition">
              Become a Rider
            </button>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <p className="mt-10 capitalize text-lg font-medium pb-4 border-b">
        My Restaurants
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-[1px_3px_3px_rgba(0,0,0,0.3)]  transition border overflow-hidden"
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <p className="font-semibold">{restaurant.name}</p>
              <div className="grid grid-cols-2 justify-between items-center mt-2 text-sm text-gray-600">
                <div>
                  <p className="capitalize">orders:</p>
                  <p>150</p>
                </div>
                <div>
                  <p className="capitalize">revenue:</p>
                  <p>$8500</p>
                </div>

                <div className="flex gap-4 mt-3 text-xs">
                  <button className="capitalize flex items-center gap-2 p-1 rounded-md border hover:bg-gray-100 transition">
                    <i className="fa-solid fa-gear"></i>
                    Manage
                  </button>

                  <button className="capitalize flex items-center gap-2 p-1 rounded-md border hover:bg-gray-100 transition">
                    <i className="fa-solid fa-box"></i>
                    Menu
                  </button>

                  <button className="capitalize flex items-center gap-2 p-1 rounded-md border hover:bg-gray-100 transition">
                    <i className="fa-solid fa-money-bill-transfer"></i>
                    Banking
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
