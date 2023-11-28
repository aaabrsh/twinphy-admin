import { useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { useNavigate } from "react-router-dom";
import { CompetitionStatus } from "../../data";

export default function CompetitionStatusSelector({
  status,
  setFilter,
}: {
  status: CompetitionStatus;
  setFilter: (status: CompetitionStatus) => void;
}) {
  const navigate = useNavigate();
  const [statusOptions] = useState([
    { label: "Scheduled", value: "scheduled" },
    { label: "Started", value: "started" },
    { label: "Ended", value: "ended" },
    { label: "Cancelled", value: "cancelled" },
  ]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 md:tw-flex-row">
      <div className="tw-flex-grow">
        <SelectButton
          value={status}
          onChange={(e) => setFilter(e.value)}
          options={statusOptions}
        />
      </div>
      <div className="">
        <button
          className="btn btn-primary !tw-flex tw-items-center tw-justify-center"
          onClick={() => navigate("/competition/create")}
        >
          <i className="bi bi-plus tw-text-3xl"></i>
          <span>New Competition</span>
        </button>
      </div>
    </div>
  );
}
