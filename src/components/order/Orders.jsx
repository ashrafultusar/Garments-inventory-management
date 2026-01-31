"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderSideModal from "@/components/order/OrderSideModal";
import ConfirmationModal from "@/components/order/ConfirmationModal";
import OrderFilters from "@/components/order/OrderFilters";
import OrderTable from "@/components/order/OrderTable";
import PaginationControls from "@/components/order/PaginationControls";
import useAppData from "@/hook/useAppData";
import useOrders from "@/hook/useOrder";
import Link from "next/link";


const Orders = () => {
  const { data } = useAppData();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL থেকে orderId নেওয়া
  const orderIdFromUrl = searchParams.get("orderId");

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [status, setStatus] = useState("");
  const [clotheType, setClotheType] = useState("");
  const [finishingType, setFinishingType] = useState("");
  const [colour, setColour] = useState("");
  const [sillName, setSillName] = useState("");
  const [quality, setQuality] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Hook থেকে প্রয়োজনীয় ফাংশনগুলো নেওয়া
  const {
    orders,
    totalPages,
    loadingOrder,
    selectedOrder,
    setSelectedOrder,
    fetchSingleOrder,
    deleteOrder,
  } = useOrders({
    currentPage,
    itemsPerPage,
    searchTerm,
    dateRange,
    customStartDate,
    customEndDate,
    status,
    clotheType,
    finishingType,
    colour,
    sillName,
    quality,
  });

  // --- Best Practice: URL-এ ID থাকলে অটোমেটিক ডাটা ফেচ করা ---
  useEffect(() => {
    if (orderIdFromUrl) {
      // শুধু একবারই ফেচ করবে যদি selectedOrder না থাকে বা ID আলাদা হয়
      if (!selectedOrder || selectedOrder._id !== orderIdFromUrl) {
        fetchSingleOrder(orderIdFromUrl);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [orderIdFromUrl, fetchSingleOrder, setSelectedOrder, selectedOrder]);

  // Handler: অর্ডারে ক্লিক করলে URL পরিবর্তন
  const handleOrderClick = useCallback((id) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderId", id);
    router.push(`/dashboard/order?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handler: মোডাল ক্লোজ করলে URL ক্লিন করা
  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("orderId");
    router.push(`/dashboard/order?${params.toString()}`, { scroll: false });
    setSelectedOrder(null);
  }, [router, searchParams, setSelectedOrder]);

  const confirmDelete = (id) => {
    setOrderToDelete(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    await deleteOrder(orderToDelete);
    setShowConfirmModal(false);
    if (orderIdFromUrl === orderToDelete) {
      closeModal();
    }
  };

  return (
    <div className="py-6 text-black relative mt-10 md:-mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/dashboard/createOrder" className="bg-black text-white px-4 py-2 rounded hover:opacity-90">
          + New Order
        </Link>
      </div>

      <OrderFilters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        dateRange={dateRange} handleDateRangeChange={setDateRange}
        status={status} setStatus={setStatus}
        clotheType={clotheType} setClotheType={setClotheType}
        finishingType={finishingType} setFinishingType={setFinishingType}
        colour={colour} setColour={setColour}
        sillName={sillName} setSillName={setSillName}
        quality={quality} setQuality={setQuality}
        showMoreFilters={showMoreFilters} setShowMoreFilters={setShowMoreFilters}
        data={data}
      />

      <OrderTable
        orders={orders}
        handleOrderClick={handleOrderClick}
        confirmDelete={confirmDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />

      {/* Side Modal */}
      <OrderSideModal
        isModalOpen={!!orderIdFromUrl}
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