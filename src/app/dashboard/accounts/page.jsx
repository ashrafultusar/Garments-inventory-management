// "use client";

// import { useEffect, useState, useRef } from "react";

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
//   useEffect(() => {
//     if (!selectedUserId) {
//       setPayments([]);
//       setTotal(0);
//       return;
//     }
//     const fetchPayments = async () => {
//       try {
//         const res = await fetch(`/api/payments?userId=${selectedUserId}`);
//         const data = await res.json();
//         setPayments(data);
//         calcTotal(data);
//       } catch (err) {
//         console.error("Failed to load payments", err);
//       }
//     };
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedUserId) {
//       alert("Please select a customer first!");
//       return;
//     }
//     const payload = { 
//       userId: selectedUserId, 
//       amount: Number(form.amount),
//       method: form.method,
//       description: form.description,
//       date: form.date
//     };

//     try {
//       const res = await fetch("/api/payments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const newPayment = await res.json();
//         const updatedPayments = [newPayment, ...payments];
//         setPayments(updatedPayments);
//         calcTotal(updatedPayments);
//         setForm({
//           amount: "",
//           method: "cash",
//           description: "",
//           date: new Date().toISOString().slice(0, 10),
//         });
//       }
//     } catch (err) {
//       alert("Error saving payment");
//     }
//   };

//   const filteredUsers = users.filter((u) =>
//     u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const currentCustomer = users.find((u) => u._id === selectedUserId);

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold border-b pb-2">Accounts Ledger (Credit Only)</h1>

//       {/* ✅ Searchable Dropdown */}
//       <div className="space-y-2 relative" ref={dropdownRef}>
//         <label className="block font-medium">Select Customer:</label>
//         <div 
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           className="border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center"
//         >
//           <span>{currentCustomer ? `${currentCustomer.companyName} (${currentCustomer.ownerName})` : "-- Choose a customer --"}</span>
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
//                 <div className="px-3 py-2 text-gray-500 text-sm">No customer found</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedUserId && (
//         <>
//           {/* ✅ Total Received Card */}
//           <div className="border rounded p-4 text-xl font-bold bg-green-50 text-green-700">
//             Total Received: ৳ {total}
//           </div>

//           {/* ✅ Add Payment Form */}
//           <form onSubmit={handleSubmit} className="border p-4 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Amount</label>
//               <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border px-3 py-2 w-full rounded" placeholder="0.00" required />
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Payment Method</label>
//               <select name="method" value={form.method} onChange={handleChange} className="border px-3 py-2 w-full rounded">
//                 <option value="cash">Cash</option>
//                 <option value="bank">Bank</option>
//                 <option value="bkash">Bkash</option>
//                 <option value="nagad">Nagad</option>
//               </select>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm font-semibold">Date</label>
//               <input type="date" name="date" value={form.date} onChange={handleChange} className="border px-3 py-2 w-full rounded" />
//             </div>

//             <div className="md:col-span-2 space-y-1">
//               <label className="text-sm font-semibold">Description</label>
//               <textarea name="description" value={form.description} onChange={handleChange} className="border px-3 py-2 w-full rounded" placeholder="Note" />
//             </div>

//             <button type="submit" className="md:col-span-2 bg-black text-white py-2 rounded hover:opacity-90 transition cursor-pointer">
//               Add Payment
//             </button>
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
//                 </tr>
//               </thead>
//               <tbody>
//                 {payments?.map((p) => (
//                   <tr key={p._id} className="hover:bg-gray-50">
//                     <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
//                     <td className="border p-2">{p.description || "-"}</td>
//                     <td className="border p-2 uppercase text-xs font-bold">{p.method}</td>
//                     <td className="border p-2 text-right font-medium">৳ {p.amount}</td>
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
import { toast } from "react-toastify";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);

  // সার্চ এবং ড্রপডাউন কন্ট্রোল
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    id: "", // এডিট করার জন্য নতুন ফিল্ড
    amount: "",
    method: "cash",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করা
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ডাটাবেস থেকে কাস্টমার লোড
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };
    fetchCustomers();
  }, []);

  // পেমেন্ট হিস্ট্রি লোড
  const fetchPayments = async () => {
    if (!selectedUserId) return;
    try {
      const res = await fetch(`/api/payments?userId=${selectedUserId}`);
      const data = await res.json();
      setPayments(data);
      calcTotal(data);
    } catch (err) {
      console.error("Failed to load payments", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedUserId]);

  // সাধারণ টোটাল ক্যালকুলেশন
  const calcTotal = (list) => {
    const sum = list.reduce((t, p) => t + p.amount, 0);
    setTotal(sum);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ এডিট করার জন্য ডাটা ফর্মে পাঠানো
  const handleEdit = (p) => {
    setForm({
      id: p._id,
      amount: p.amount,
      method: p.method,
      description: p.description || "",
      date: new Date(p.date).toISOString().slice(0, 10),
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // ফর্মের কাছে নিয়ে যাবে
  };

  // ✅ পেমেন্ট ডিলিট করার হ্যান্ডলার
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(`/api/payments?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPayments(); // লিস্ট রিফ্রেশ করবে
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Please select a customer first!");
      return;
    }

    const isEditing = !!form.id; // id থাকলে বুঝবো এটা আপডেট
    const payload = { 
      id: form.id,
      userId: selectedUserId, 
      amount: Number(form.amount),
      method: form.method,
      description: form.description,
      date: form.date
    };

    try {
      const res = await fetch("/api/payments", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchPayments(); // সব ডাটা রিফ্রেশ করবে
        setForm({
          id: "",
          amount: "",
          method: "cash",
          description: "",
          date: new Date().toISOString().slice(0, 10),
        });
        if(isEditing) toast.success("Payment Updated!");
      }
    } catch (err) {
      toast.error("Error saving payment");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCustomer = users.find((u) => u._id === selectedUserId);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold border-b pb-2">Accounts Ledger (Credit Only)</h1>

      {/* ✅ Searchable Dropdown */}
      <div className="space-y-2 relative" ref={dropdownRef}>
        <label className="block font-medium">Select Customer:</label>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="border px-3 py-2 rounded w-full bg-white cursor-pointer flex justify-between items-center"
        >
          <span>{currentCustomer ? `${currentCustomer.companyName} (${currentCustomer.ownerName})` : "-- Choose a customer --"}</span>
          <span className="text-gray-400">▼</span>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-xl overflow-hidden">
            <input
              type="text"
              placeholder="Search customer..."
              className="w-full px-3 py-2 border-b outline-none bg-blue-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => {
                      setSelectedUserId(u._id);
                      setIsDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className="px-3 py-2 hover:bg-blue-600 hover:text-white cursor-pointer border-b last:border-0"
                  >
                    <div className="font-bold text-sm">{u.companyName}</div>
                    <div className="text-xs opacity-70">{u.ownerName}</div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">No customer found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedUserId && (
        <>
          {/* ✅ Total Received Card */}
          <div className="border rounded p-4 text-xl font-bold bg-green-50 text-green-700 flex justify-between items-center">
            <span>Total Received: ৳ {total}</span>
            {form.id && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Editing Record...</span>}
          </div>

          {/* ✅ Add/Edit Payment Form */}
          <form onSubmit={handleSubmit} className="border p-4 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Amount</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} className="border px-3 py-2 w-full rounded" placeholder="0.00" required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Payment Method</label>
              <select name="method" value={form.method} onChange={handleChange} className="border px-3 py-2 w-full rounded">
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="bkash">Bkash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="border px-3 py-2 w-full rounded" />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="border px-3 py-2 w-full rounded" placeholder="Note" />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className={`flex-1 text-white py-2 rounded transition cursor-pointer ${form.id ? 'bg-orange-600' : 'bg-black'}`}>
                {form.id ? "Update Payment" : "Add Payment"}
              </button>
              {form.id && (
                <button 
                  type="button" 
                  onClick={() => setForm({ id: "", amount: "", method: "cash", description: "", date: new Date().toISOString().slice(0, 10) })}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ✅ Transaction History Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-left text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Method</th>
                  <th className="border p-2 text-right">Amount</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="border p-2">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="border p-2">{p.description || "-"}</td>
                    <td className="border p-2 uppercase text-[10px] font-bold">{p.method}</td>
                    <td className="border p-2 text-right font-medium">৳ {p.amount}</td>
                    <td className="border p-2 text-center space-x-3">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-800 font-semibold cursor-pointer">Delete</button>
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