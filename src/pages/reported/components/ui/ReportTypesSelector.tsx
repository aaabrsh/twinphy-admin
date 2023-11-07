import { useState } from "react";
import { SelectButton } from "primereact/selectbutton";

export default function ReportTypesSelector({
  status,
  setFilter,
}: {
  status: string;
  setFilter: (status: string) => void;
}) {
  const [sizeOptions] = useState([
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
    { label: "Ignored", value: "ignored" },
  ]);

  return (
    <div className="flex justify-content-center mb-4">
      <SelectButton
        value={status}
        onChange={(e) => setFilter(e.value)}
        options={sizeOptions}
      />
    </div>
  );
}
