import CardsContainer from "./components/container/CardsContainer";
import LatestCompetitions from "./components/container/LatestCompetitions";
import TopUsers from "./components/container/TopUsers";

export default function Dashboard() {
  return (
    <>
      <div className="">
        <div className="row">
          <CardsContainer />

          <LatestCompetitions />

          <TopUsers />
        </div>
      </div>
    </>
  );
}
