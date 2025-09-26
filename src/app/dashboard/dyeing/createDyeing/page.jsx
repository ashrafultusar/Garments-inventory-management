"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateDyeing() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    location: "",
    employees: [{ employeeName: "", designation: "", info: "" }],
  });

  // handle input change
  const handleChange = (e, index, field) => {
    if (field) {
      const newEmployees = [...form.employees];
      newEmployees[index][field] = e.target.value;
      setForm({ ...form, employees: newEmployees });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // add new employee row
  const addEmployee = () => {
    setForm({
      ...form,
      employees: [...form.employees, { employeeName: "", designation: "", info: "" }],
    });
  };

  // remove employee row
  const removeEmployee = (index) => {
    const newEmployees = form.employees.filter((_, i) => i !== index);
    setForm({ ...form, employees: newEmployees });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/dyeings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create dyeing");

      toast.success("Dyeing created successfully!");
      router.push("/dashboard/dyeing");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Dyeing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dyeing name */}
        <input
          type="text"
          name="name"
          placeholder="Dyeing Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Dyeing location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Employees */}
        <div>
          <h3 className="font-semibold mb-2">Employees</h3>
          {form.employees.map((emp, index) => (
            <div key={index} className="border p-3 mb-2 rounded">
              <input
                type="text"
                placeholder="Employee Name"
                value={emp.employeeName}
                onChange={(e) => handleChange(e, index, "employeeName")}
                className="w-full border px-2 py-1 mb-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Designation"
                value={emp.designation}
                onChange={(e) => handleChange(e, index, "designation")}
                className="w-full border px-2 py-1 mb-2 rounded"
                required
              />
              <textarea
                placeholder="Info"
                value={emp.info}
                onChange={(e) => handleChange(e, index, "info")}
                className="w-full border px-2 py-1 mb-2 rounded"
              />
              {form.employees.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmployee(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEmployee}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add Employee
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
