"use client";

export default function DummyLedger() {
  const customer = {
    name: "BRITNEY SPEARS",
  };

  const ledger = [
    {
      date: "07/16/18",
      cpt: "97124.GP",
      loc: "—",
      class: "—",
      provider: "10576",
      description: "MASSAGE THERAPY",
      charge: 75.0,
      payment: "",
      balance: 300.0,
    },
    {
      date: "07/16/18",
      cpt: "97110.GP",
      loc: "—",
      class: "—",
      provider: "10576",
      description: "THERAPEUTIC EXERCISES",
      charge: 50.0,
      payment: "",
      balance: 350.0,
    },
    {
      date: "07/16/18",
      cpt: "97010.GP",
      loc: "—",
      class: "—",
      provider: "10576",
      description: "HOT OR COLD PACKS THERAPY",
      charge: 15.0,
      payment: "",
      balance: 365.0,
    },
    {
      date: "07/16/18",
      cpt: "",
      loc: "",
      class: "",
      provider: "",
      description: "Adjustments applied",
      charge: "",
      payment: 29.5,
      balance: 335.5,
    },
    {
      date: "07/16/18",
      cpt: "",
      loc: "",
      class: "",
      provider: "",
      description: "Insurance payment (Chk #74125)",
      charge: "",
      payment: 190.5,
      balance: 145.0,
    },
  ];

  return (
    <div className="bg-white p-8 mt-8 rounded-xl shadow">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Client Ledger Statement</h1>
          <p className="mt-2">
            <strong>Client:</strong>{" "}
            <span className="px-2 py-1 border rounded bg-gray-50">
              {customer.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="border px-3 py-1 rounded bg-gray-200">
            Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border mt-6 rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Provider</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-right">Charge</th>
              <th className="px-3 py-2 text-right">Payment</th>
              <th className="px-3 py-2 text-right">Balance</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2">{row.provider}</td>
                <td className="px-3 py-2">{row.description}</td>
                <td className="px-3 py-2 text-right">
                  {row.charge !== "" ? row.charge.toFixed(2) : ""}
                </td>
                <td className="px-3 py-2 text-right">
                  {row.payment !== "" ? row.payment.toFixed(2) : ""}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {row.balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Totals */}
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t">
              <td colSpan={6} className="px-3 py-2 text-right">
                Totals:
              </td>
              <td className="px-3 py-2 text-right">155.00</td>
              <td className="px-3 py-2 text-right">220.00</td>
              <td className="px-3 py-2 text-right">145.00</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
