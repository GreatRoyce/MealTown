import React from 'react'

function Rider() {
  return (
    <>
<div className="bg-gray-200 min-h-screen">
  <div className="flex flex-col pt-10 w-[90%] mx-auto space-y-4">
    <p className="capitalize text-lg font-semibold">Rider Dashboard</p>

    <div className="border border-red-600 bg-white rounded-lg p-4 relative">
      {/* Notification Row */}
      <div className="flex items-center space-x-3">
        <i className="fa-solid fa-bell text-red-600"></i>
        <p className="text-sm opacity-60 text-gray-700">
          You need to become a rider first to access the rider dashboard.
        </p>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button className="flex items-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition">
          <i className="fa-solid fa-motorcycle"></i>
          Become a Rider
        </button>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default Rider