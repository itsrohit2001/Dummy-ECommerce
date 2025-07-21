import React, { useEffect, useState } from "react";

const UserPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details from backend
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-gray-500">Please log in to view your profile.</span>
      </div>
    );
  }

  return (
    <div className="max-w-lg p-8 mx-auto my-12 border border-blue-200 shadow-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl">
      <div className="flex flex-col items-center">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=6366f1&color=fff&size=32`}
          alt="User Avatar"
          className="mb-4 border-4 border-white rounded-full shadow-lg w-28 h-28"
        />
        <h2 className="mb-2 text-3xl font-extrabold text-blue-700 drop-shadow">My Profile</h2>
        <div className="w-full p-6 mt-4 shadow bg-white/80 rounded-xl">
          <div className="flex items-center mb-4">
            <span className="w-32 font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{user.name || "N/A"}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="w-32 font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
          {/* Add more fields as needed */}
        </div>
        <button
          className="px-6 py-2 mt-8 font-semibold text-white transition bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => window.location.href = "/"}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default UserPage;