import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { getDateAndTime } from "../../../../utils/time";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function LatestCompetitions({
  data,
}: {
  data: { scheduled: any[]; started: any[]; ended: any[]; cancelled: any[] };
}) {
  const filterOptions = ["scheduled", "started", "ended", "cancelled"];
  const [filter, setFilter] = useState("scheduled");
  const [currentData, setCurrentData] = useState<any>([]);

  useEffect(() => {
    switch (filter) {
      case "started":
        setCurrentData(data?.started ?? []);
        break;
      case "ended":
        setCurrentData(data?.ended ?? []);
        break;
      case "cancelled":
        setCurrentData(data?.cancelled ?? []);
        break;
      case "scheduled":
      default:
        setCurrentData(data?.scheduled ?? []);
    }
  }, [filter]);

  return (
    <>
      <div className="col-12">
        <div className="card recent-sales overflow-auto">
          <div className="card-body">
            <h5 className="card-title">Competitions</h5>

            <div className="mb-2 tw-flex gap-2 tw-flex-col sm:tw-flex-row md:tw-items-end">
              <div className="tw-flex-grow">
                <span className="">
                  <div className="mb-1 tw-font-bold text-muted">
                    Competition Status
                  </div>
                  <Dropdown
                    value={filter}
                    onChange={(e) => setFilter(e.value)}
                    options={filterOptions}
                    className={`tw-min-w-[200px] ${
                      filterOptions ? "tw-border-[#4154f1]" : ""
                    }`}
                  />
                </span>
              </div>
              <div>
                <Link to={"/competition"}>
                  <Button
                    className="tw-rounded"
                    icon={"bi bi-arrow-right me-2"}
                  >
                    See All
                  </Button>
                </Link>
              </div>
            </div>

            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((row: any) => (
                    <tr key={row._id}>
                      <td className="text-primary tw-font-semibold">
                        {row.name}
                      </td>
                      <td className="tw-font-semibold text-muted">
                        {getDateAndTime(row.start_date)}
                      </td>
                      <td className="tw-font-semibold text-muted">
                        {getDateAndTime(row.end_date)}
                      </td>
                      <td className="tw-font-semibold text-muted">
                        <i className="bi bi-currency-rupee"></i>
                        <span>{row.amount ?? 0}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td
                        colSpan={4}
                        className="tw-text-center tw-font-semibold text-muted tw-text-lg"
                      >
                        No Data Found!
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
