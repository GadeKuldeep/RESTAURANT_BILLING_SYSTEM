import path from "path";
import { getFormattedDate, getCurrentTime } from "../utils/dateUtils.js";
import { appendToExcel } from "../utils/excelUtils.js";
import { generateInvoiceId } from "../utils/generateInvoiceId.js";

export const generateBill = async (req, res) => {
  const { customerName, items, total } = req.body;

  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ message: "Missing bill data" });
  }

  const dateStr = getFormattedDate();     // 📅 utils
  const timeStr = getCurrentTime();       // ⏰ utils
  const invoiceId = generateInvoiceId();  // 🧾 utils
  const billFolder = path.resolve("bills");
  const filePath = path.join(billFolder, `${dateStr}.xlsx`);

  const rows = items.map(item => ({
    InvoiceID: invoiceId,
    "Customer Name": customerName,
    Dish: item.name,
    Qty: item.qty,
    "Unit Price": item.price,
    "Item Total": item.qty * item.price,
    "Total Bill": total,
    Date: dateStr,
    Time: timeStr,
  }));

  try {
    appendToExcel(filePath, rows); // 📝 utils
    res.status(200).json({ message: "Bill saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving bill", error: err.message });
  }
};
