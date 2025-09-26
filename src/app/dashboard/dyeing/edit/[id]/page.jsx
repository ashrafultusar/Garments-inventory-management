"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function EditDyeing() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/dyeings/${id}`)
        .then((res) => res.json())
        .then((data) => setForm(data))
        .catch(() => toast.error("Failed to fetch dyeing"));
    }
  }, [id]);

  const handleChange = (e, index, field) => {
    if (field) {
      const newEmployees = [...form.employees];
      newEmployees[index][field] = e.target.value;
      setForm({ ...form, employees: newEmployees });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addEmployee = () => {
    setForm({
      ...form,
      employees: [...form.employees, { employeeName: "", designation: "", info: "" }],
    });
  };

  const removeEmployee = (index) => {
    const newEmployees = form.employees.filter((_, i) => i !== index);
    setForm({ ...form, employees: newEmployees });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/dyeings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update dyeing");

      toast.success("Dyeing updated successfully!");
      router.push("/dashboard/dyeing");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Dyeing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Dyeing Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

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

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
