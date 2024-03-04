import { useEffect, useState } from "react";
import CardsContainer from "./components/container/CardsContainer";
import LatestCompetitions from "./components/container/LatestCompetitions";
import TopUsers from "./components/container/TopUsers";
import { get } from "../../services/api";
import { toast } from "react-toastify";
import DashboardLoadingUI from "./components/ui/DashboardLoadingUI";

export default function Dashboard() {
  const [apiData, setApiData] = useState<any>({});
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setPageLoading(true);
    get("dashboard", {
      usersCount: true,
      competitionsCount: true,
      totalRevenue: true,
      last5Competitios: true,
      top50Users: true,
    })
      .then((res) => {
        setApiData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response?.data?.message ?? "Error! couldn't load data");
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    return <DashboardLoadingUI />;
  }

  return (
    <>
      <div className="">
        <div className="row">
          <CardsContainer data={apiData} />

          <LatestCompetitions data={apiData.last5Competitios ?? {}} />

          <TopUsers data={apiData.top50Users ?? []} />
        </div>
      </div>
    </>
  );
}
