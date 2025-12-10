import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RequirementForm, RequirementItem } from "@/types/requirement";

export function generateRequirementPDF(
  formData: RequirementForm,
  items: RequirementItem[]
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 84, 61); // Primary green
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Kitchen Requirement", pageWidth / 2, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Hotel Kitchen Management System", pageWidth / 2, 32, { align: "center" });
  
  // Form Details Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Requirement Details", 14, 55);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  
  const formattedDate = new Date(formData.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const details = [
    ["Date:", formattedDate],
    ["Chef Name:", formData.chefName],
    ["Meal Type:", formData.mealType],
    ["Number of Pax:", formData.numberOfPax.toString()],
  ];
  
  let yPos = 65;
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 55, yPos);
    yPos += 8;
  });
  
  // Items Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Items List", 14, yPos + 10);
  
  const validItems = items.filter((item) => item.item.trim() !== "");
  const tableData = validItems.map((item, index) => [
    (index + 1).toString(),
    item.item,
    item.qty.toString(),
    item.unit,
    `₹${item.price.toFixed(2)}`,
    `₹${(item.qty * item.price).toFixed(2)}`,
  ]);
  
  const grandTotal = validItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  
  autoTable(doc, {
    startY: yPos + 15,
    head: [["#", "Item", "Qty", "Unit", "Price", "Total"]],
    body: tableData,
    foot: [["", "", "", "", "Grand Total:", `₹${grandTotal.toFixed(2)}`]],
    theme: "striped",
    headStyles: {
      fillColor: [34, 84, 61],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
      5: { cellWidth: 35, halign: "right" },
    },
  });
  
  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 200;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on: ${new Date().toLocaleString("en-IN")}`,
    14,
    finalY + 20
  );
  doc.text(
    "Hotel Kitchen Management System",
    pageWidth - 14,
    finalY + 20,
    { align: "right" }
  );
  
  // Save PDF
  const fileName = `Requirement_${formData.chefName}_${formData.date}_${formData.mealType}.pdf`;
  doc.save(fileName);
}
