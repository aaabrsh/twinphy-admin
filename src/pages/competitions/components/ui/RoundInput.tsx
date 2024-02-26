import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Round } from "../../data";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { getNextHour_noMin } from "../../../../utils/time";

export default function RoundInput({
  index,
  round,
  prev,
  error,
  is_last,
  current_round,
  onRoundInputChange,
}: {
  index: number;
  round: Round | null;
  prev: Round | null;
  error: any;
  is_last: boolean;
  current_round: number | null;
  onRoundInputChange: (
    key: string,
    index: number,
    value: string | Date | number | null
  ) => void;
}) {
  useEffect(() => {
    onRoundInputChange("name", index, round?.name ?? "Round " + (index + 1));
  }, []);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-7 tw-mb-5">
        <div className="dark-blue tw-font-bold">Round {index + 1}</div>
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-7">
          <div>
            <span className="p-float-label">
              <InputText
                id="name"
                value={round?.name ?? "Round " + (index + 1)}
                onChange={(e) =>
                  onRoundInputChange("name", index, e.target.value)
                }
                className={`tw-w-full ${error?.name ? "p-invalid" : ""}`}
                min={0}
              />
              <label htmlFor="name">Round Name</label>
            </span>
            {error?.name && (
              <small className="tw-text-red-500">{error.name}</small>
            )}
          </div>
          <div>
            <span className="p-float-label">
              <InputNumber
                inputId="min_likes"
                value={round?.min_likes}
                onChange={(e) =>
                  onRoundInputChange("min_likes", index, e.value)
                }
                className={`tw-w-full ${error?.min_likes ? "p-invalid" : ""}`}
                min={0}
                disabled={current_round !== null && index + 1 < current_round}
              />
              <label htmlFor="min_likes">Minimum Likes Needed</label>
            </span>
            {error?.min_likes && (
              <small className="tw-text-red-500">{error.min_likes}</small>
            )}
          </div>
          {!is_last && (
            <div>
              <span className="p-float-label">
                <InputNumber
                  inputId="percentage_to_advance"
                  value={round?.percentage_to_advance}
                  onChange={(e) =>
                    onRoundInputChange("percentage_to_advance", index, e.value)
                  }
                  className={`tw-w-full ${
                    error?.percentage_to_advance ? "p-invalid" : ""
                  }`}
                  min={1}
                  max={100}
                  prefix="%"
                  disabled={current_round !== null && index + 1 < current_round}
                />
                <label htmlFor="percentage_to_advance">
                  Top % to Advance Forward
                </label>
              </span>
              {error?.percentage_to_advance && (
                <small className="tw-text-red-500">
                  {error.percentage_to_advance}
                </small>
              )}
            </div>
          )}
          <div>
            <span className="p-float-label">
              <Calendar
                inputId="start_date"
                value={round?.start_date}
                onChange={(e) =>
                  onRoundInputChange("start_date", index, e.value ?? null)
                }
                className={`tw-w-full ${error?.start_date ? "p-invalid" : ""}`}
                minDate={
                  prev?.start_date
                    ? getNextHour_noMin(prev?.start_date)
                    : new Date()
                }
                showTime
                hourFormat="12"
                stepMinute={60}
                stepHour={1}
                disabled={current_round !== null && index + 1 <= current_round}
              />
              <label htmlFor="start_date">Start Date</label>
            </span>
            {error?.start_date && (
              <small className="tw-text-red-500">{error.start_date}</small>
            )}
          </div>

          {is_last && (
            <div>
              <span className="p-float-label">
                <Calendar
                  inputId="end_date"
                  value={round?.end_date}
                  onChange={(e) =>
                    onRoundInputChange("end_date", index, e.value ?? null)
                  }
                  className={`tw-w-full ${error?.end_date ? "p-invalid" : ""}`}
                  minDate={
                    round?.start_date
                      ? getNextHour_noMin(round?.start_date)
                      : new Date()
                  }
                  showTime
                  hourFormat="12"
                  stepMinute={60}
                  stepHour={1}
                />
                <label htmlFor="end_date">End Date</label>
              </span>
              {error?.end_date && (
                <small className="tw-text-red-500">{error.end_date}</small>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
