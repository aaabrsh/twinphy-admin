import { Link } from "react-router-dom";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../utils/asset-paths";
import { getName } from "../../../../utils/getName";
import { Button } from "primereact/button";

export default function TopUsers({ data }: { data: any[] }) {
  return (
    <>
      <div className="col-12">
        <div className="card top-selling overflow-auto">
          <div className="card-body pb-0">
            <h5 className="card-title">Top 50 Users</h5>

            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Profile Image</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Followers</th>
                  <th scope="col">Total Posts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row._id}>
                    <td scope="tw-text-center">
                      <Link to={"/user/" + row.username}>
                        <img
                          alt=""
                          src={formatResourceURL(row.profile_img)}
                          onError={handleProfileImageError}
                          className="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-mb-2 tw-block"
                        />
                      </Link>
                    </td>
                    <td>
                      <Link to={"/user/" + row.username}>{getName(row)}</Link>
                    </td>
                    <td>
                      <Link to={"/user/" + row.username}>@{row.username}</Link>
                    </td>
                    <td>{row.followers_count}</td>
                    <td>{row.posts_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mb-2">
              <Link to={"/user/list"}>
                <Button className="tw-rounded" icon={"bi bi-arrow-right me-2"}>
                  See All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
