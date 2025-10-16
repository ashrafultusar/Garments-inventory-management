
"use client";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaPencilAlt, FaPrint } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { CiGrid41 } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OrderStatus from "../OrderStatus/OrderStatus";
import PrintInvoice from "../Print/PrintInvoice/PrintInvoice";

const OrderSideModal = ({
  isModalOpen,
  loadingOrder,
  selectedOrder,
  closeModal,
  confirmDelete,
}) => {
  const router = useRouter();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [printOrder, setPrintOrder] = useState(null);

  const handlePrint = (order) => {
    setPrintOrder(order);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeModal}
          />

          {/* Sidebar Modal */}
          <motion.div
            className="relative w-full sm:w-[350px] md:w-[450px] h-full bg-white shadow-lg border-l border-gray-200 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-bold">
                {selectedOrder?.orderId || "N/A"}
              </h2>
              <IoClose
                className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                onClick={closeModal}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingOrder ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {/* Collapsible header */}
                  <div
                    className="p-4 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <CiGrid41 className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-base uppercase font-medium">
                          {selectedOrder?.clotheType || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible content */}
                  <AnimatePresence initial={false}>
                    {isDetailsOpen && (
                      <motion.div
                        key="collapsible"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6 pt-2">
                          {/* Order details */}
                          <div className="grid grid-cols-2 gap-4 text-gray-700">
                            <div>
                              <p className="text-xs text-gray-500">
                                Created at
                              </p>
                              <p className="font-semibold">
                                {selectedOrder?.createdAt
                                  ? new Date(
                                      selectedOrder.createdAt
                                    ).toLocaleDateString()
                                  : "Invalid Date"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Due Date</p>
                              <p className="font-semibold">
                                {selectedOrder?.dueDate
                                  ? new Date(
                                      selectedOrder.dueDate
                                    ).toLocaleDateString()
                                  : "Invalid Date"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Bundle</p>
                              <p className="font-semibold">
                                {selectedOrder?.bundle || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Quantity</p>
                              <p className="font-semibold">
                                {selectedOrder?.quality || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="border-t pt-2">
                            <h3 className="font-semibold text-gray-700 mb-4">
                              Timeline
                            </h3>
                            <div className="relative pl-6">
                              <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                              <div className="relative mb-4">
                                <div className="absolute left-0 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                                <div className="ml-4 space-y-1">
                                  <p className="font-semibold text-gray-700">
                                    Order Created
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {selectedOrder?.createdAt
                                      ? new Date(
                                          selectedOrder.createdAt
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          timeZoneName: "short",
                                        })
                                      : "Invalid Date"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrint(selectedOrder);
                                }}
                                className="text-gray-600 hover:text-gray-900 flex justify-center items-center gap-1 border p-1 border-gray-500 rounded cursor-pointer"
                              >
                                Print
                                <FaPrint size={18} />
                              </button>
                            </div>
                          </div>

                          {/* Footer buttons */}
                          <div className="pt-4 border-t flex justify-between gap-4 bg-white">
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/order/update/${selectedOrder?._id}`
                                )
                              }
                              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
                            >
                              <FaPencilAlt className="inline-block mr-2" />
                              Edit Order
                            </button>
                            <button
                              onClick={() => confirmDelete(selectedOrder?._id)}
                              className="flex-1 py-3 px-4 cursor-pointer bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                            >
                              <LuTrash2 className="inline-block mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status Component */}
                  <OrderStatus
                  selectedOrder={selectedOrder}
                    orderId={selectedOrder?._id}
                    currentStatus={selectedOrder?.status || "Pending"}
                    tableData={selectedOrder?.tableData || []}
                    onStatusChange={(newStatus) => {
                      selectedOrder.status = newStatus;
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>

          {/* Render PrintInvoice */}
          {printOrder && <PrintInvoice order={printOrder} />}
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSideModal;
