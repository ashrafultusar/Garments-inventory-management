"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import useAppData from "@/hook/useAppData";

export default function BatchEditPage() {
  const { batchId: embeddedBatchId } = useParams();
  const router = useRouter();
  const { data } = useAppData();

  const [embeddedBatch, setEmbeddedBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingRow, setAddingRow] = useState(false);
  const [availableRows, setAvailableRows] = useState([]);
  const [parentBatchDocId, setParentBatchDocId] = useState(null);

  // 🔹 Dropdown States
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedFinishing, setSelectedFinishing] = useState("");
  const [selectedSill, setSelectedSill] = useState("");
  const [selectedDyeing, setSelectedDyeing] = useState("");
  const [selectedCalender, setSelectedCalender] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState([]);

  useEffect(() => {
    const fetchBatch = async () => {
      if (!embeddedBatchId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/batch/allbatch/${embeddedBatchId}`);
        const data = await res.json();
        if (res.ok) {
          setEmbeddedBatch(data.embeddedBatch);
          setAvailableRows(data.availableRows || []);
          setParentBatchDocId(data.parentBatchDocId);

          // ✅ Prefill dropdown values
          const b = data.embeddedBatch;
          setSelectedColour(b.colour || "");
          setSelectedFinishing(b.finishingType || "");
          setSelectedSill(b.sillName || "");
          setSelectedDyeing(b.dyeing || "");
          setSelectedCalender(b.calender || "");
          if (b.selectedProcesses?.length > 0) {
            setSelectedProcesses(b.selectedProcesses.map((p) => p.name));
          }
        } else {
          toast.error(data.error || "Failed to load batch");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error while fetching batch");
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [embeddedBatchId]);

  // 🔹 Dropdown Components
  const Dropdown = ({ label, options, selected, setSelected, optional }) => (
    <div className="w-44 mb-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="block w-full py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 cursor-pointer"
      >
        <option value="">{optional ? "None" : "Select"}</option>
        {options?.map((opt) => (
          <option key={opt._id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );

  const MultiSelectDropdown = ({ label, options, selected, setSelected }) => {
    const toggle = (name) => {
      if (selected.includes(name)) {
        setSelected(selected.filter((s) => s !== name));
      } else {
        setSelected([...selected, name]);
      }
    };
    return (
      <div className="w-44 mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="border border-gray-300 rounded-md p-1 bg-white">
          {options?.map((opt) => (
            <div
              key={opt._id}
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.name)}
                onChange={() => toggle(opt.name)}
              />
              <span>{opt.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 🔹 Row Management
  const handleDeleteRow = (rollNo) => {
    if (!confirm(`Roll No: ${rollNo} মুছে ফেলতে চাও?`)) return;
    const removedRow = embeddedBatch.rows.find((row) => row.rollNo === rollNo);
    const updatedRows = embeddedBatch.rows.filter(
      (row) => row.rollNo !== rollNo
    );
    setEmbeddedBatch({ ...embeddedBatch, rows: updatedRows });
    if (removedRow) {
      setAvailableRows((prev) => [...prev, removedRow]);
    }
  };

  const handleAddRow = (rollNo) => {
    const rowToAdd = availableRows.find((r) => r.rollNo === rollNo);
    if (!rowToAdd) return;
    setEmbeddedBatch({
      ...embeddedBatch,
      rows: [...embeddedBatch.rows, rowToAdd],
    });
    setAvailableRows(availableRows.filter((r) => r.rollNo !== rollNo));
    setAddingRow(false);
  };

  const handleIndexChange = (e, rowRollNo) => {
    const value = Number(e.target.value);
    const updatedRows = embeddedBatch.rows.map((row) => {
      if (row.rollNo === rowRollNo) {
        return { ...row, idx: value > 0 ? [value] : [] };
      }
      return row;
    });
    setEmbeddedBatch({ ...embeddedBatch, rows: updatedRows });
  };

  // 🔹 Save Handler
  const handleSave = async () => {
    if (!embeddedBatch || loading) return;

    try {
      setLoading(true);

      const processesPayload = selectedProcesses.map((pname) => {
        const p = data.process.find((pr) => pr.name === pname);
        return { name: p.name, price: p.price };
      });

      const updatedBatch = {
        ...embeddedBatch,
        colour: selectedColour,
        finishingType: selectedFinishing,
        sillName: selectedSill,
        dyeing: selectedDyeing,
        calender: selectedCalender || null,
        selectedProcesses: processesPayload,
      };

      const res = await fetch(`/api/batch/allbatch/${embeddedBatchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeddedBatchData: updatedBatch }),
      });

      const dataRes = await res.json();

      if (res.ok) {
        toast.success("Batch updated successfully!");
        router.push(`/dashboard/order`);
      } else {
        toast.error(dataRes.message || "Failed to save batch");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while saving batch");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !embeddedBatch) {
    return <p className="p-6 text-gray-500 text-center">Loading...</p>;
  }

  const getIndexValue = (row) =>
    row.idx && row.idx.length > 0 ? row.idx[0] : "";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg border p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {embeddedBatch.batchName}
          </h2>
          <CheckCircle2 className="text-green-600 w-5 h-5" />
        </div>

        {/* Editable Dropdowns */}
        <div className="flex flex-wrap gap-4 mb-6 py-4 px-3 border rounded-lg bg-gray-50 shadow-sm">
          <Dropdown
            label="Colour"
            options={data?.colours || []}
            selected={selectedColour}
            setSelected={setSelectedColour}
          />
          <Dropdown
            label="Sill Name"
            options={data?.sillNames || []}
            selected={selectedSill}
            setSelected={setSelectedSill}
          />
          <Dropdown
            label="Finishing Type"
            options={data?.finishingTypes || []}
            selected={selectedFinishing}
            setSelected={setSelectedFinishing}
          />
          <Dropdown
            label="Dyeing"
            options={data?.dyeings || []}
            selected={selectedDyeing}
            setSelected={setSelectedDyeing}
          />
          {selectedProcesses.some((p) => p.toLowerCase() === "calender") && (
            <Dropdown
              label="Calender"
              options={data?.calender || []}
              selected={selectedCalender}
              setSelected={setSelectedCalender}
              optional={true}
            />
          )}
          <MultiSelectDropdown
            label="Process List"
            options={data?.process || []}
            selected={selectedProcesses}
            setSelected={setSelectedProcesses}
          />
        </div>

        {/* Rows Table */}
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border text-sm text-gray-700">
            <thead className="bg-gray-100 border-b font-medium">
              <tr>
                <th className="p-2 text-left">Roll No</th>
                <th className="p-2 text-left">Goj</th>
                <th className="p-2 text-left">Index</th>
                <th className="p-2 text-left">Extras</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {embeddedBatch.rows.length > 0 ? (
                embeddedBatch.rows.map((row) => (
                  <tr key={row.rollNo} className="border-b hover:bg-gray-50">
                    <td className="p-2">{row.rollNo}</td>
                    <td className="p-2">{row.goj}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={getIndexValue(row)}
                        onChange={(e) => handleIndexChange(e, row.rollNo)}
                        className="w-20 border rounded px-2 py-1 text-center"
                      />
                    </td>
                    <td className="p-2 text-center">{row.extras ?? "—"}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteRow(row.rollNo)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 p-4 italic"
                  >
                    No rows currently in this batch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Row Section */}
        <div className="mb-4">
          <button
            onClick={() => setAddingRow(!addingRow)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            {addingRow ? "Cancel Add" : "Add Row from Order"}
          </button>

          {addingRow && (
            <div className="mt-3 border border-gray-200 p-3 rounded-md bg-gray-50 max-h-56 overflow-y-auto">
              {availableRows.length > 0 ? (
                availableRows.map((r) => (
                  <div
                    key={r.rollNo}
                    className="flex justify-between items-center py-1 border-b last:border-0 text-sm"
                  >
                    <span>
                      Roll No: <span className="font-semibold">{r.rollNo}</span>{" "}
                      | Goj: <span className="font-semibold">{r.goj}</span>
                    </span>
                    <button
                      onClick={() => handleAddRow(r.rollNo)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No available rows to add.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="bg-red-600 text-white px-5 py-2 rounded-md cursor-pointer hover:bg-red-700"
          >
            Cancle
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-5 py-2 rounded-md cursor-pointer hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
