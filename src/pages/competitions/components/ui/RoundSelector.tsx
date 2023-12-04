import { Dropdown } from "primereact/dropdown";

export default function RoundSelector({
  rounds,
  selectedRound,
  roundChanged,
}: {
  rounds: any[];
  selectedRound: any;
  roundChanged: (round: any) => void;
}) {
  return (
    <>
      <div className="tw-flex tw-flex-wrap tw-gap-3 tw-font-normal">
        {/* Provider */}
        <span className="p-float-label tw-mt-5">
          <Dropdown
            inputId="provider"
            value={selectedRound}
            onChange={(e) => roundChanged(e.value)}
            options={rounds}
            optionLabel="name"
            className="tw-min-w-[200px]"
          />
          <label htmlFor="provider">Select Round</label>
        </span>
      </div>
    </>
  );
}
