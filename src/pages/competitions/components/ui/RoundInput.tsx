import { Calendar } from "primereact/calendar";
import { Round } from "../../data";
import { InputNumber } from "primereact/inputnumber";

export default function RoundInput({
  index,
  round,
  prev,
  error,
  is_last,
  onRoundInputChange,
}: {
  index: number;
  round: Round | null;
  prev: Round | null;
  error: any;
  is_last: boolean;
  onRoundInputChange: (
    key: string,
    index: number,
    value: string | Date | number | null
  ) => void;
}) {
  const getNextDay = (date: Date) => {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    return tomorrow;
  };

  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-7 tw-mb-5">
        <div className="dark-blue tw-font-bold">Round {index + 1}</div>
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-7">
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
              />
              <label htmlFor="min_likes">Minimum Likes Needed</label>
            </span>
            {error?.min_likes && (
              <small className="tw-text-red-500">{error.min_likes}</small>
            )}
          </div>
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
                  prev?.start_date ? getNextDay(prev?.start_date) : new Date()
                }
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
                      ? getNextDay(round?.start_date)
                      : new Date()
                  }
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
