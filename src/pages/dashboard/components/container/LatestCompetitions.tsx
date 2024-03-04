import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export default function LatestCompetitions() {
  const filterOptions = ["scheduled", "started", "ended", "cancelled"];
  const [filter, setFilter] = useState("scheduled");

  return (
    <>
      <div className="col-12">
        <div className="card recent-sales overflow-auto">
          <div className="card-body">
            <h5 className="card-title">Competitions</h5>

            <div className="mb-2">
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

            <table className="table table-borderless datatable">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <a href="#">#2457</a>
                  </th>
                  <td>Brandon Jacob</td>
                  <td>
                    <a href="#" className="text-primary">
                      At praesentium minu
                    </a>
                  </td>
                  <td>$64</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2147</a>
                  </th>
                  <td>Bridie Kessler</td>
                  <td>
                    <a href="#" className="text-primary">
                      Blanditiis dolor omnis similique
                    </a>
                  </td>
                  <td>$47</td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2049</a>
                  </th>
                  <td>Ashleigh Langosh</td>
                  <td>
                    <a href="#" className="text-primary">
                      At recusandae consectetur
                    </a>
                  </td>
                  <td>$147</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2644</a>
                  </th>
                  <td>Angus Grady</td>
                  <td>
                    <a href="#" className="text-primar">
                      Ut voluptatem id earum et
                    </a>
                  </td>
                  <td>$67</td>
                  <td>
                    <span className="badge bg-danger">Rejected</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="#">#2644</a>
                  </th>
                  <td>Raheem Lehner</td>
                  <td>
                    <a href="#" className="text-primary">
                      Sunt similique distinctio
                    </a>
                  </td>
                  <td>$165</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
