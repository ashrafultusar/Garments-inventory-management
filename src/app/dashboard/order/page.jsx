// "use client";


// import OrderSideModal from "@/components/order/OrderSideModal";
// import ConfirmationModal from "@/components/order/ConfirmationModal";
// import OrderFilters from "@/components/order/OrderFilters";
// import OrderTable from "@/components/order/OrderTable";
// import PaginationControls from "@/components/order/PaginationControls";
// import useAppData from "@/hook/useAppData";
// import useOrders from "@/hook/useOrder";
// import Link from "next/link";
// import { useState } from "react";

// const Orders = () => {
//   const { data } = useAppData();

//   // States
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(12);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateRange, setDateRange] = useState("");
//   const [customStartDate, setCustomStartDate] = useState(null);
//   const [customEndDate, setCustomEndDate] = useState(null);
//   const [status, setStatus] = useState("");
//   const [clotheType, setClotheType] = useState("");
//   const [finishingType, setFinishingType] = useState("");
//   const [colour, setColour] = useState("");
//   const [sillName, setSillName] = useState("");
//   const [quality, setQuality] = useState("");
//   const [showMoreFilters, setShowMoreFilters] = useState(false);

//   // Confirmation Modal
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);

//   // Hook
//   const {
//     orders,
//     totalPages,
//     loadingOrder,
//     selectedOrder,
//     setSelectedOrder,
//     fetchSingleOrder,
//     deleteOrder,
//   } = useOrders({
//     currentPage,
//     itemsPerPage,
//     searchTerm,
//     dateRange,
//     customStartDate,
//     customEndDate,
//     status,
//     clotheType,
//     finishingType,
//     colour,
//     sillName,
//     quality,
//   });

//   // Handlers
//   const handleOrderClick = async (id) => {
//     await fetchSingleOrder(id);
//   };

//   const confirmDelete = (id) => {
//     setOrderToDelete(id);
//     setShowConfirmModal(true);
//   };

//   const handleDelete = async () => {
//     await deleteOrder(orderToDelete);
//     setShowConfirmModal(false);
//     setOrderToDelete(null);
//     if (selectedOrder && selectedOrder._id === orderToDelete) {
//       setSelectedOrder(null);
//     }
//   };

//   const handleCustomApply = () => {
//     if (!customStartDate || !customEndDate) {
//       toast.error("Please select both start and end date");
//       return;
//     }
//   };

// // console.log(orders);

//   return (
//     <div className="py-6 text-black relative mt-10 md:-mt-4">


//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Orders</h1>
//         <Link
//           href={"/dashboard/createOrder"}
//           className="bg-black text-white px-4 py-2 rounded hover:opacity-90 cursor-pointer"
//         >
//           + New Order
//         </Link>
//       </div>

//       {/* Filters */}
//       <OrderFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         dateRange={dateRange}
//         handleDateRangeChange={setDateRange}
//         customStartDate={customStartDate}
//         setCustomStartDate={setCustomStartDate}
//         customEndDate={customEndDate}
//         setCustomEndDate={setCustomEndDate}
//         handleCustomApply={handleCustomApply}
//         status={status}
//         setStatus={setStatus}
//         clotheType={clotheType}
//         setClotheType={setClotheType}
//         finishingType={finishingType}
//         setFinishingType={setFinishingType}
//         colour={colour}
//         setColour={setColour}
//         sillName={sillName}
//         setSillName={setSillName}
//         quality={quality}
//         setQuality={setQuality}
//         showMoreFilters={showMoreFilters}
//         setShowMoreFilters={setShowMoreFilters}
//         data={data}
//       />

//       {/* Table */} 
//       <OrderTable
//         orders={orders}
//         handleOrderClick={handleOrderClick}
//         confirmDelete={confirmDelete}
//       />

//       {/* Pagination */}
//       <PaginationControls
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={setCurrentPage}
//         itemsPerPage={itemsPerPage}
//         onItemsPerPageChange={(value) => {
//           setItemsPerPage(value);
//           setCurrentPage(1);
//         }}
//       />


//       {/* Modals */}
//       <OrderSideModal
//         isModalOpen={!!selectedOrder}
//         isClosing={false}
//         isOpening={false}
//         loadingOrder={loadingOrder}
//         selectedOrder={selectedOrder}
//         closeModal={() => setSelectedOrder(null)}
//         confirmDelete={confirmDelete}
//       />

//       <ConfirmationModal
//         showConfirmModal={showConfirmModal}
//         onCancel={() => setShowConfirmModal(false)}
//         onConfirm={handleDelete}
//       />
//     </div>
//   );
// };

// export default Orders;




import Orders from "@/components/order/Orders";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
        <span className="ml-2">Loading Orders...</span>
      </div>
    }>
      <Orders />
    </Suspense>
    <div className="py-1 md:py-16 lg:py-6 text-black relative mt-10 md:-mt-4">


      
        {/* HEADER SECTION (Like Image) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-6 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 shadow-sm">
              <ShoppingCart
               className="text-[#2563eb]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e293b]">Orders</h1>
              <p className="text-sm text-gray-500 font-medium">Manage and track all your orders</p>
            </div>
          </div>
          <Link
            href={"/dashboard/createOrder"}
            className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm shadow-blue-200 cursor-pointer"
          >
            <Plus size={18} /> New Order
          </Link>
        </div>

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateRange={dateRange}
        handleDateRangeChange={setDateRange}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        handleCustomApply={handleCustomApply}
        status={status}
        setStatus={setStatus}
        clotheType={clotheType}
        setClotheType={setClotheType}
        finishingType={finishingType}
        setFinishingType={setFinishingType}
        colour={colour}
        setColour={setColour}
        sillName={sillName}
        setSillName={setSillName}
        quality={quality}
        setQuality={setQuality}
        showMoreFilters={showMoreFilters}
        setShowMoreFilters={setShowMoreFilters}
        data={data}
      />

      {/* Table */} 
      <OrderTable
        orders={orders}
        handleOrderClick={handleOrderClick}
        confirmDelete={confirmDelete}
      />

      {/* Pagination */}
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


      {/* Modals */}
      <OrderSideModal
        isModalOpen={!!selectedOrder}
        isClosing={false}
        isOpening={false}
        loadingOrder={loadingOrder}
        selectedOrder={selectedOrder}
        closeModal={() => setSelectedOrder(null)}
        confirmDelete={confirmDelete}
      />

      <ConfirmationModal
        showConfirmModal={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}