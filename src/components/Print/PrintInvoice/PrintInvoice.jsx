"use client";
import React, { useEffect } from "react";

const PrintInvoice = ({ order }) => {
  useEffect(() => {
    if (!order) return;

    const headers = Object.keys(order?.tableData?.[0] || {}).filter(
      (key) => key !== "_id"
    );

    const tableRows =
      order?.tableData?.length > 0
        ? order.tableData
            .map(
              (row) =>
                `<tr>${headers
                  .map((h) => `<td>${row[h] || ""}</td>`)
                  .join("")}</tr>`
            )
            .join("")
        : `<tr><td colspan="${headers.length}">No Data Found</td></tr>`;

    const printContent = `
      <html>
        <head>
          <title>Invoice - ${order?.orderId}</title>
          <style>
            @media print { @page { size: A4; margin: 20mm; } }
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 22px; font-weight: bold; }
            .invoice-id { font-size: 18px; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${order?.companyName || "N/A"}</div>
            <div class="invoice-id">Invoice: ${order?.orderId}</div>
          </div>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to enable printing.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  }, [order]);

  return null;
};

export default PrintInvoice;
