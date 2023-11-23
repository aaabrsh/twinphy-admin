import { useState } from "react";
import { SelectButton } from "primereact/selectbutton";

export default function CompetitionStatusSelector({
  status,
  setFilter,
  newCompetitionClicked,
}: {
  status: "scheduled" | "started" | "ended";
  setFilter: (status: "scheduled" | "started" | "ended") => void;
  newCompetitionClicked: () => void;
}) {
  const [statusOptions] = useState([
    { label: "Scheduled", value: "scheduled" },
    { label: "Started", value: "started" },
    { label: "Ended", value: "ended" },
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
          onClick={newCompetitionClicked}
        >
          <i className="bi bi-plus tw-text-3xl"></i>
          <span>New Competition</span>
        </button>
      </div>
    </div>
  );
}
