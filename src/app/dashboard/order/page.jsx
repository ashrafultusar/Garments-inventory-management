"use client";
import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { toast } from "react-toastify";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-purple-100 text-purple-700";
    case "Billing":
      return "bg-yellow-100 text-yellow-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "In Process":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentColor = (payment) => {
  return payment === "Paid"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetch("/api/order")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Open modal & fetch order details
  const handleOrderClick = async (id) => {
    try {
      setLoadingOrder(true);
      const res = await fetch(`/api/order/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setSelectedOrder(data);

      setIsModalOpen(true);
      setIsClosing(false);
      setIsOpening(true); // Start with modal off-screen

      setTimeout(() => setIsOpening(false), 20);
    } catch (err) {
      console.error("Error fetching single order:", err);
    } finally {
      setLoadingOrder(false);
    }
  };

  // Close modal with animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedOrder(null);
      setIsClosing(false);
    }, 300);
  };

  // Open confirm modal for deletion
  const confirmDelete = (id) => {
    setOrderToDelete(id);
    setShowConfirmModal(true);
  };

  // Delete order function with confirmation modal
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/order/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete order");
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));

      if (selectedOrder && selectedOrder._id === id) {
        closeModal();
      }

      toast.success("Order deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order. Please try again.");
    }
  };

  return (
    <div className="p-6 text-black relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link
          href={"/dashboard/createOrder"}
          className="bg-black text-white px-4 py-2 rounded hover:opacity-90 cursor-pointer"
        >
          + New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full sm:w-96 border border-gray-300 rounded px-4 py-2"
        />

        <div className="space-x-3">
          <select className="border border-gray-300 rounded px-4 py-2">
            <option>Date range</option>
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
          </select>

          <select className="border border-gray-300 rounded px-4 py-2">
            <option>Status</option>
            <option>Pending</option>
            <option>Delivered</option>
            <option>Billing</option>
          </select>

          <select className="border border-gray-300 rounded px-4 py-2">
            <option>Address</option>
            <option>Rajshahi</option>
            <option>Dhaka</option>
            <option>Others</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-4 text-left whitespace-nowrap">ID NO.</th>
              <th className="p-4 text-left whitespace-nowrap">Product</th>
              <th className="p-4 text-left whitespace-nowrap">Customer</th>
              <th className="p-4 text-left whitespace-nowrap">Status</th>
              <th className="p-4 text-left whitespace-nowrap">Quantity</th>
              <th className="p-4 text-left whitespace-nowrap">Payment</th>
              <th className="p-4 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order?._id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOrderClick(order._id)}
              >
                <td className="p-4 whitespace-nowrap">{order?._id}</td>
                <td className="p-4 whitespace-nowrap">{order?.dyeingName || "N/A"}</td>
                <td className="p-4 whitespace-nowrap">{order?.customerName || "N/A"}</td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                      order?.status
                    )}`}
                  >
                    {order?.status || "N/A"}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">{order?.quality || "N/A"}</td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentColor(
                      order?.paymentMethod
                    )}`}
                  >
                    {order?.paymentMethod || "Unpaid"}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <FaPencilAlt className="w-4 h-4 text-gray-500 hover:text-black cursor-pointer" />
                    <LuTrash2
                      className="w-4 h-4 text-gray-500 hover:text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(order._id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          {/* Background Overlay */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div
            className={`relative w-[350px] md:w-[450px] h-full bg-white shadow-lg border-l border-gray-200 overflow-y-auto p-6
              transform transition-transform duration-300
              ${
                isClosing
                  ? "translate-x-full"
                  : isOpening
                  ? "translate-x-full"
                  : "translate-x-0"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{selectedOrder._id}</h2>
                <p className="text-sm text-gray-500">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <IoClose
                className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                onClick={closeModal}
              />
            </div>

            {/* Loading State */}
            {loadingOrder ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Order Details */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-base font-medium">{selectedOrder.customerName || "N/A"}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Product</p>
                    <p className="text-base font-medium">{selectedOrder.dyeingName || "N/A"}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentColor(
                          selectedOrder.paymentMethod
                        )}`}
                      >
                        {selectedOrder.paymentMethod || "Unpaid"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="text-base font-medium">{selectedOrder.quality || "N/A"}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer shadow hover:bg-blue-700 transition">
                    Edit Order
                  </button>
                  <button
                    onClick={() => confirmDelete(selectedOrder._id)}
                    className="px-4 py-2 bg-red-100 text-red-700 cursor-pointer rounded-lg shadow hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-300 cursor-pointer rounded hover:bg-gray-400"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 cursor-pointer py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  handleDelete(orderToDelete);
                  setShowConfirmModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
