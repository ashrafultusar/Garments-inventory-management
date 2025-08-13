import React from "react";
import { IoClose } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { CiGrid41 } from "react-icons/ci";
import { useRouter } from "next/navigation";

const getPaymentColor = (payment) => {
  return payment === "Paid"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
};

const OrderSideModal = ({
  isModalOpen,
  isClosing,
  isOpening,
  loadingOrder,
  selectedOrder,
  closeModal,
  confirmDelete,
}) => {
  if (!isModalOpen) return null;
  const router = useRouter();



  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={closeModal}
      ></div>

      <div
        className={`relative w-[350px] md:w-[450px] h-full bg-white shadow-lg border-l border-gray-200 overflow-y-auto transform transition-transform duration-300 ${
          isClosing || isOpening ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            #{selectedOrder?.orderId || "N/A"}
          </h2>
          <IoClose
            className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
            onClick={closeModal}
          />
        </div>

        {loadingOrder ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <CiGrid41 className="text-2xl" />
              </div>
              <div>
                <p className="text-base font-medium">
                  {selectedOrder?.clotheType || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Created at</p>
                <p className="font-semibold">
                  {selectedOrder?.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleDateString()
                    : "Invalid Date"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Due Date</p>
                <p className="font-semibold">
                  {selectedOrder?.dueDate
                    ? new Date(selectedOrder.dueDate).toLocaleDateString()
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

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Payment Status
              </h3>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${getPaymentColor(
                  selectedOrder?.paymentMethod
                )}`}
              >
                {selectedOrder?.paymentMethod || "Unpaid"}
              </span>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Customer name</p>
                  <p className="font-semibold text-gray-700">
                    {selectedOrder?.companyName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color Profile</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 border border-gray-300"></div>
                    <p className="font-semibold text-gray-700">
                      {selectedOrder?.colorProfile || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Width</p>
                  <p className="font-semibold text-gray-700">
                    {selectedOrder?.width || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quality Grade</p>
                  <p className="font-semibold text-gray-700">
                    {selectedOrder?.qualityGrade || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                <div className="relative mb-4">
                  <div className="absolute left-0 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-700">Order Created</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder?.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZoneName: "short",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t flex justify-between gap-4 sticky bottom-0 bg-white">
          <button
            onClick={() =>
              router.push(`/dashboard/order/update/${selectedOrder?._id}`)
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
    </div>
  );
};

export default OrderSideModal;
