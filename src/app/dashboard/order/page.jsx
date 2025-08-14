"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import OrderTable from "@/components/order/OrderTable";
import OrderSideModal from "@/components/order/3. OrderSideModal";
import ConfirmationModal from "@/components/order/ConfirmationModal";
import PaginationControls from "@/components/order/PaginationControls"; 

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  // Fetch orders on dependencies change
  useEffect(() => {
    fetchOrders(
      currentPage,
      itemsPerPage,
      searchTerm,
      dateRange,
      customStartDate,
      customEndDate
    );
  }, [currentPage, itemsPerPage, searchTerm, dateRange, customStartDate, customEndDate]);

  const fetchOrders = async (page, limit, search = "", dateRangeValue = "", start = null, end = null) => {
    let startDate = "";
    let endDate = "";
    const today = dayjs();

    switch (dateRangeValue) {
      case "last_week":
        startDate = today.subtract(1, "week").startOf("week").toISOString();
        endDate = today.subtract(1, "week").endOf("week").toISOString();
        break;
      case "last_month":
        startDate = today.subtract(1, "month").startOf("month").toISOString();
        endDate = today.subtract(1, "month").endOf("month").toISOString();
        break;
      case "this_week":
        startDate = today.startOf("week").toISOString();
        endDate = today.endOf("week").toISOString();
        break;
      case "this_month":
        startDate = today.startOf("month").toISOString();
        endDate = today.endOf("month").toISOString();
        break;
      case "last_3_days":
        startDate = today.subtract(3, "day").startOf("day").toISOString();
        endDate = today.endOf("day").toISOString();
        break;
      case "custom":
        if (start && end) {
          startDate = start.toISOString();
          endDate = end.toISOString();
        }
        break;
      default:
        break;
    }

    try {
      const res = await fetch(
        `/api/order?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const { orders: fetchedOrders, totalCount } = await res.json();
      setOrders(fetchedOrders);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Error fetching orders. Please try again.");
    }
  };

  // Handle order click for modal
  const handleOrderClick = async (id) => {
    setLoadingOrder(true);
    try {
      const res = await fetch(`/api/order/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data = await res.json();
      setSelectedOrder(data);
      setIsModalOpen(true);
      setIsClosing(false);
      setIsOpening(true);
      setTimeout(() => setIsOpening(false), 20);
    } catch (err) {
      console.error("Error fetching single order:", err);
      toast.error("Error fetching order details.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedOrder(null);
      setIsClosing(false);
    }, 300);
  };

  const confirmDelete = (id) => {
    setOrderToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/order/${orderToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete order");

      await fetchOrders(currentPage, itemsPerPage, searchTerm, dateRange, customStartDate, customEndDate);
      if (selectedOrder && selectedOrder._id === orderToDelete) {
        closeModal();
      }
      toast.success("Order deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order. Please try again.");
    } finally {
      setShowConfirmModal(false);
      setOrderToDelete(null);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Handle dropdown change
  const handleDateRangeChange = (value) => {
    setDateRange(value);
    if (value !== "custom") {
      setCustomStartDate(null);
      setCustomEndDate(null);
      fetchOrders(currentPage, itemsPerPage, searchTerm, value);
    }
  };

  // Custom date apply
  const handleCustomApply = () => {
    if (!customStartDate || !customEndDate) {
      toast.error("Please select both start and end date");
      return;
    }
  
    const start = dayjs(customStartDate).startOf("day").toDate();
    const end = dayjs(customEndDate).endOf("day").toDate();
  
    fetchOrders(
      currentPage,
      itemsPerPage,
      searchTerm,
      "custom",
      start,
      end
    );
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

      <div className="flex flex-wrap justify-between gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 border border-gray-300 rounded px-4 py-2"
        />

        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
          >
            <option value="">Date range</option>
            <option value="last_week">Last week</option>
            <option value="last_month">Last month</option>
            <option value="this_week">This week</option>
            <option value="this_month">This month</option>
            <option value="last_3_days">Last 3 days</option>
            <option value="custom">Custom</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <DatePicker
                selected={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                placeholderText="Start Date"
                className="border border-gray-300 rounded px-4 py-2"
              />
              <DatePicker
                selected={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                placeholderText="End Date"
                className="border border-gray-300 rounded px-4 py-2"
              />
              <button
                onClick={handleCustomApply}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
          )}

          <select className="border border-gray-300 rounded px-4 py-2">
            <option>Status</option>
          </select>
          <select className="border border-gray-300 rounded px-4 py-2">
            <option>Address</option>
          </select>
        </div>
      </div>

      <OrderTable
        orders={orders}
        handleOrderClick={handleOrderClick}
        confirmDelete={confirmDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <OrderSideModal
        isModalOpen={isModalOpen}
        isClosing={isClosing}
        isOpening={isOpening}
        loadingOrder={loadingOrder}
        selectedOrder={selectedOrder}
        closeModal={closeModal}
        confirmDelete={confirmDelete}
      />

      <ConfirmationModal
        showConfirmModal={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Orders;
