"use client";
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { LuTrash2 } from 'react-icons/lu';

const orders = [
  {
    id: 'ORD-2025-011',
    product: 'Ocean Blue (Polyester)',
    customer: 'ABC Textiles Ltd',
    status: 'Delivered',
    quantity: '65',
    payment: 'Unpaid',
  },
  {
    id: 'ORD-2025-010',
    product: 'Sunset Orange (Polyester)',
    customer: 'ABC Textiles Ltd',
    status: 'Billing',
    quantity: '4',
    payment: 'Unpaid',
  },
  {
    id: 'ORD-2025-003',
    product: 'Sunset Orange (Silk)',
    customer: 'Global Fabrics Inc',
    status: 'Delivered',
    quantity: '300 yards',
    payment: 'Paid',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-purple-100 text-purple-700';
    case 'Billing':
      return 'bg-yellow-100 text-yellow-700';
    case 'Pending':
      return 'bg-orange-100 text-orange-700';
    case 'In Process':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getPaymentColor = (payment) => {
  return payment === 'Paid'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
};

const Orders = () => {
  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="bg-black text-white px-4 py-2 rounded hover:opacity-90">
          + New Order
        </button>
      </div>

      {/* Top Filters */}
      <div className="flex flex-wrap justify-between gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full sm:w-64 border border-gray-300 rounded px-4 py-2"
        />

        <div className='space-x-3'>
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
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap">{order.id}</td>
                <td className="p-4 whitespace-nowrap">{order.product}</td>
                <td className="p-4 whitespace-nowrap">{order.customer}</td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">{order.quantity}</td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getPaymentColor(
                      order.payment
                    )}`}
                  >
                    {order.payment}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <FaPencilAlt className="w-4 h-4 text-gray-500 hover:text-black cursor-pointer" />
                    <LuTrash2 className="w-4 h-4 text-gray-500 hover:text-red-600 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
