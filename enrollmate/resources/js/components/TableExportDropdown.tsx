import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { saveAs } from "file-saver";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import ExcelJS from "exceljs";

interface TableExportDropdownProps {
  data: any[];
}

export default function TableExportDropdown({ data }: TableExportDropdownProps) {
  const handleCopy = () => {
    if (data.length === 0) {
      toast.error("No data to copy.");
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => row[header as keyof typeof row]).join("\t")
    );
    const text = [headers.join("\t"), ...rows].join("\n");

    copy(text);
    toast.success(`${data.length} row(s) copied to clipboard!`);
  };

  const handleCSVExport = () => {
    if (data.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "OneHotel.csv");
    toast.success("CSV exported successfully!");
  };

  const handleExcelExport = async () => {
    if (data.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((row) => {
      worksheet.addRow(headers.map((header) => row[header as keyof typeof row]));
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "OneHotel.xlsx");

    toast.success("Excel exported successfully!");
  };

  const handlePrint = () => {
    if (data.length === 0) {
      toast.error("No data to print.");
      return;
    }

    const printableContent = data
      .map((row) => Object.values(row).join(" | "))
      .join("\n");
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre style="font-size:16px;">${printableContent}</pre>`);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="dark:bg-neutral-950 hover:dark:bg-neutral-900">
          Export<FileDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopy}>Copy</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCSVExport}>CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={handleExcelExport}>Excel</DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>Print</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
