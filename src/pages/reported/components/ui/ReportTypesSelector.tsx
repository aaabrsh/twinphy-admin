import { useState } from "react";
import { SelectButton } from "primereact/selectbutton";

export default function ReportTypesSelector({
  status,
  setFilter,
}: {
  status: string;
  setFilter: (status: string) => void;
}) {
  const [typeOptions] = useState([
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
    { label: "Ignored", value: "ignored" },
  ]);

  return (
    <div className="flex justify-content-center">
      <SelectButton
        value={status}
        onChange={(e) => setFilter(e.value)}
        options={typeOptions}
      />
    </div>
  );
}
