// "use client";

// import { useEffect, useState, useRef } from "react";
// import { FaEdit } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { toast } from "react-toastify";

// export default function Page() {
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [payments, setPayments] = useState([]);
//   const [total, setTotal] = useState(0);

//   // সার্চ এবং ড্রপডাউন কন্ট্রোল
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);

//   const [form, setForm] = useState({
//     id: "", // এডিট করার জন্য নতুন ফিল্ড
//     amount: "",
//     method: "cash",
//     description: "",
//     date: new Date().toISOString().slice(0, 10),
//   });

//   // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করা
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ডাটাবেস থেকে কাস্টমার লোড
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await fetch("/api/customers");
//         const data = await res.json();
//         setUsers(data);
//       } catch (err) {
//         console.error("Failed to load customers", err);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   // পেমেন্ট হিস্ট্রি লোড
//   const fetchPayments = async () => {
//     if (!selectedUserId) return;
//     try {
//       const res = await fetch(`/api/payments?userId=${selectedUserId}`);
//       const data = await res.json();
//       setPayments(data);
//       calcTotal(data);
//     } catch (err) {
//       console.error("Failed to load payments", err);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [selectedUserId]);

//   // সাধারণ টোটাল ক্যালকুলেশন
//   const calcTotal = (list) => {
//     const sum = list.reduce((t, p) => t + p.amount, 0);
//     setTotal(sum);
//   };

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // ✅ এডিট করার জন্য ডাটা ফর্মে পাঠানো
//   const handleEdit = (p) => {
//     setForm({
//       id: p._id,
//       amount: p.amount,
//       method: p.method,
//       description: p.description || "",
//       date: new Date(p.date).toISOString().slice(0, 10),
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ✅ পেমেন্ট ডিলিট করার হ্যান্ডলার
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this?")) return;
//     try {
//       const res = await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
//       if (res.ok) {
//         fetchPayments();
//       }
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUserId) {
//       alert("Please select a customer first!");
//       return;
//     }

//     const isEditing = !!form.id;
//     const payload = {
//       id: form.id,
//       userId: selectedUserId,
//       amount: Number(form.amount),
//       method: form.method,
//       description: form.description,
//       date: form.date,
//     };

//     try {
//       const res = await fetch("/api/payments", {
//         method: isEditing ? "PUT" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         fetchPayments();
//         setForm({
//           id: "",
//           amount: "",
//           method: "cash",
//           description: "",
//           date: new Date().toISOString().slice(0, 10),
//         });
//         if (isEditing) toast.success("Payment Updated!");
//       }
//     } catch (err) {
//       toast.error("Error saving payment");
//     }
//   };

//   const filteredUsers = users.filter(
//     (u) =>
//       u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const currentCustomer = users.find((u) => u._id === selectedUserId);

//   return (
//     <div className="py-14 md:py-16 lg:py-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold border-b pb-2">
//         Accounts Ledger (Credit Only)
//       </h1>

//       {/* ✅ Searchable Dropdown */}
//       <div className="space-y-2 relative" ref={dropdownRef}>
//         <label className="block font-medium">Select Customer:</label>
//         <div
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           className="border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center"
//         >
//           <span>
//             {currentCustomer
//               ? `${currentCustomer.companyName} (${currentCustomer.ownerName})`
//               : "-- Choose a customer --"}
//           </span>
//           <span className="text-gray-400">▼</span>
//         </div>

//         {isDropdownOpen && (
//           <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-xl overflow-hidden">
//             <input
//               type="text"
//               placeholder="Search customer..."
//               className="w-full px-3 py-2 border-b outline-none bg-blue-50 focus:bg-white"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               autoFocus
//             />
//             <div className="max-h-60 overflow-y-auto">
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((u) => (
//                   <div
//                     key={u._id}
//                     onClick={() => {
//                       setSelectedUserId(u._id);
//                       setIsDropdownOpen(false);
//                       setSearchTerm("");
//                     }}
//                     className="px-3 py-2 hover:bg-blue-600 hover:text-white cursor-pointer border-b last:border-0"
//                   >
//                     <div className="font-bold text-sm">{u.companyName}</div>
//                     <div className="text-xs opacity-70">{u.ownerName}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="px-3 py-2 text-gray-500 text-sm">
//                   No customer found
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedUserId && (
//         <>
//           {/* ✅ Total Received Card */}
//           <div className="border rounded p-4 text-xl font-bold bg-green-50 text-green-700 flex justify-between items-center">
//             <span>Total Received: ৳ {total}</span>
//             {form.id && (
//               <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
//                 Editing Record...
//               </span>
//             )}
//           </div>

//           {/* ✅ Add/Edit Payment Form */}
//           <form
//             onSubmit={handleSubmit}
//             className="border p-4 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={form.amount}
//                 onChange={handleChange}
//                 className="border px-3 py-2 w-full rounded"
//                 placeholder="0.00"
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Payment Method</label>
//               <select
//                 name="method"
//                 value={form.method}
//                 onChange={handleChange}
//                 className="border px-3 py-2 w-full rounded"
//               >
//                 <option value="cash">Cash</option>
//                 <option value="bank">Bank</option>
//                 <option value="bkash">Bkash</option>
//                 <option value="nagad">Nagad</option>
//               </select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Date</label>
//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className="border px-3 py-2 w-full rounded"
//               />
//             </div>

//             <div className="md:col-span-2 space-y-1">
//               <label className="text-sm font-semibold">Description</label>
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 className="border px-3 py-2 w-full rounded"
//                 placeholder="Note"
//               />
//             </div>

//             <div className="md:col-span-2 flex gap-2">
//               <button
//                 type="submit"
//                 className={`flex-1 text-white py-2 rounded transition cursor-pointer ${
//                   form.id ? "bg-orange-600" : "bg-green-500"
//                 }`}
//               >
//                 {form.id ? "Update Payment" : "Add Payment"}
//               </button>
//               {form.id && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setForm({
//                       id: "",
//                       amount: "",
//                       method: "cash",
//                       description: "",
//                       date: new Date().toISOString().slice(0, 10),
//                     })
//                   }
//                   className="bg-gray-400 text-white px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>

//           {/* ✅ Transaction History Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full border text-left text-sm">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border p-2">Date</th>
//                   <th className="border p-2">Description</th>
//                   <th className="border p-2">Method</th>
//                   <th className="border p-2 text-right">Amount</th>
//                   <th className="border p-2 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {payments?.map((p) => (
//                   <tr key={p._id} className="hover:bg-gray-50">
//                     <td className="border p-2">
//                       {new Date(p.date).toLocaleDateString()}
//                     </td>
//                     <td className="border p-2">{p.description || "-"}</td>
//                     <td className="border p-2 uppercase text-[10px] font-bold">
//                       {p.method}
//                     </td>
//                     <td className="border p-2 text-right font-medium">
//                       ৳ {p.amount}
//                     </td>
//                     <td className="border p-2 text-center space-x-3">
//                       <button
//                         onClick={() => handleEdit(p)}
//                         className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(p._id)}
//                         className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
//                       >
//                         <MdDeleteForever />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { FaEdit, FaUser, FaFillDrip, FaCalendarAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";

export default function Page() {
  const [entities, setEntities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [type, setType] = useState("customer"); // 'customer', 'dyeing', 'calendar'
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    id: "",
    amount: "",
    method: "cash",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // টাইপ পরিবর্তন হলে ডাটা লোড করা
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        let endpoint = "/api/customers"; // default
        if (type === "dyeing") endpoint = "/api/dyeings";
        if (type === "calendar") endpoint = "/api/calender";

        const res = await fetch(endpoint);
        const data = await res.json();
        setEntities(Array.isArray(data) ? data : []);
        setSelectedId(""); // Reset selection
        setPayments([]);
        setTotal(0);
      } catch (err) {
        toast.error("Failed to load list");
      }
    };
    fetchEntities();
  }, [type]);

  // পেমেন্ট হিস্ট্রি লোড
  const fetchPayments = async () => {
    if (!selectedId) return;
    try {
      // এখানে type ও পাঠানো হচ্ছে
      const res = await fetch(
        `/api/payments?userId=${selectedId}&type=${type}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayments(data);
        setTotal(data.reduce((t, p) => t + p.amount, 0));
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return toast.warning("Please select an entry!");

    const payload = {
      id: form.id,
      userId: selectedId,
      type: type, 
      amount: Number(form.amount),
      method: form.method,
      description: form.description,
      date: form.date,
    };

    try {
      const res = await fetch("/api/payments", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPayments();
        setForm({ id: "", amount: "", method: "cash", description: "", date: new Date().toISOString().slice(0, 10) });
        toast.success("Success!");
      }
    } catch (err) {
      toast.error("Error saving data");
    }
  };

  const handleEdit = (p) => {
    setForm({
      id: p._id,
      amount: p.amount,
      method: p.method,
      description: p.description || "",
      date: new Date(p.date).toISOString().slice(0, 10),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.info("Deleted!");
      fetchPayments();
    }
  };

  const filteredEntities = entities.filter((ent) =>
    (ent.companyName || ent.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const currentSelection = entities.find((ent) => ent._id === selectedId);

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-3">
        Payment Ledger
      </h1>

      {/* ✅ Toggle Tabs */}
      <div className="flex  bg-gray-100 p-1 rounded-xl shadow-inner">
        {[
          { id: "customer", label: "Customer", icon: <FaUser /> },
          { id: "dyeing", label: "Dyeing", icon: <FaFillDrip /> },
          { id: "calendar", label: "Calendar", icon: <FaCalendarAlt /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setType(tab.id)}
            className={`flex-1 flex items-center justify-center cursor-pointer gap-2 py-2.5 rounded-lg font-bold transition-all ${
              type === tab.id
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ Searchable Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full border-2 border-gray-200 p-3 rounded-lg bg-white cursor-pointer flex justify-between items-center hover:border-blue-300 transition"
        >
          <span
            className={
              currentSelection ? "font-semibold text-gray-800" : "text-gray-400"
            }
          >
            {currentSelection
              ? `${currentSelection.companyName || currentSelection.name} ${
                  currentSelection.ownerName
                    ? `(${currentSelection.ownerName})`
                    : ""
                }`
              : `Select ${type}...`}
          </span>
          <span>{isDropdownOpen ? "▲" : "▼"}</span>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden">
            <input
              type="text"
              className="w-full p-3 border-b outline-none focus:bg-blue-50"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredEntities.map((ent) => (
                <div
                  key={ent._id}
                  onClick={() => {
                    setSelectedId(ent._id);
                    setIsDropdownOpen(false);
                    setSearchTerm("");
                  }}
                  className="p-3 hover:bg-blue-600 hover:text-white cursor-pointer border-b last:border-0 transition"
                >
                  <div className="font-bold">{ent.companyName || ent.name}</div>
                  <div className="text-xs opacity-80">
                    {ent.ownerName || "No Owner Info"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedId && (
        <>
          {/* ✅ Total Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90 uppercase tracking-widest font-semibold">
                Total Received
              </p>
              <h2 className="text-3xl font-black">
                ৳ {total.toLocaleString()}
              </h2>
            </div>
            {form.id && (
              <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold animate-pulse">
                EDITING MODE
              </div>
            )}
          </div>

          {/* ✅ Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border-2 border-gray-50 p-2.5 rounded-lg focus:border-blue-400 outline-none bg-gray-50 font-semibold"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-full border-2 border-gray-50 p-2.5 rounded-lg focus:border-blue-400 outline-none bg-gray-50 font-semibold"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border-2 border-gray-50 p-2.5 rounded-lg focus:border-blue-400 outline-none bg-gray-50 font-semibold"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border-2 border-gray-50 p-2.5 rounded-lg focus:border-blue-400 outline-none bg-gray-50"
                placeholder="Note here..."
                rows="2"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                  form.id
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {form.id ? "Update Entry" : "Save Payment"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: "",
                      amount: "",
                      method: "cash",
                      description: "",
                      date: new Date().toISOString().slice(0, 10),
                    })
                  }
                  className="bg-gray-200 text-gray-600 px-6 rounded-xl font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ✅ Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-bold text-gray-600 border-b">Date</th>
                  <th className="p-4 font-bold text-gray-600 border-b">
                    Method
                  </th>
                  <th className="p-4 font-bold text-gray-600 border-b">
                    Description
                  </th>
                  <th className="p-4 font-bold text-gray-600 border-b text-right">
                    Amount
                  </th>
                  <th className="p-4 font-bold text-gray-600 border-b text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-50/30 transition">
                    <td className="p-4 text-gray-700">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                        {p.method}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-[150px] truncate">
                      {p.description || "-"}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800">
                      ৳ {p.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-500 hover:scale-110 transition inline-block"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-500 hover:scale-110 transition inline-block"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
