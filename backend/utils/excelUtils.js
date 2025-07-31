import XLSX from "xlsx";
import fs from "fs";
import path from "path";

export const appendToExcel = (filePath, rows) => {
  let workbook, worksheet;

  if (fs.existsSync(filePath)) {
    const wb = XLSX.readFile(filePath);
    worksheet = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    const newData = [...data, ...rows];
    worksheet = XLSX.utils.json_to_sheet(newData);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
  } else {
    worksheet = XLSX.utils.json_to_sheet(rows);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
  }

  XLSX.writeFile(workbook, filePath);
};
