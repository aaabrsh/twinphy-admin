import { Button } from "primereact/button";
import RoundSelector from "../ui/RoundSelector";
import {
  getDateWithTime,
  isTodayEarlierThanDate,
} from "../../../../utils/time";

export default function CompetitorTableHeader({
  rounds,
  currentRound,
  competitionInfo,
  roundChanged,
  advanceRound,
  showResults,
}: {
  rounds: any[];
  currentRound: any;
  competitionInfo: any;
  roundChanged: (round: number) => void;
  advanceRound: () => void;
  showResults: () => void;
}) {
  return (
    <>
      <div>
        {competitionInfo && (
          <div className="">
            <p>Result Date: {getDateWithTime(competitionInfo.result_date)}</p>
            <p>Current Round: {competitionInfo.current_round}</p>
          </div>
        )}
        <div className="tw-flex tw-items-center">
          <div className="tw-flex-grow">
            <RoundSelector
              roundChanged={roundChanged}
              selectedRound={currentRound}
              rounds={rounds}
            />
          </div>
          <div>
            {competitionInfo?.status === "started" && (
              <Button
                label={
                  competitionInfo?.current_round ===
                  competitionInfo?.rounds_count
                    ? "End Competition"
                    : "Start Next Round"
                }
                icon="bi bi-skip-forward-fill"
                className="tw-h-10 rounded"
                onClick={advanceRound}
              />
            )}
            {competitionInfo?.status === "ended" &&
              isTodayEarlierThanDate(competitionInfo?.result_date ?? "") && (
                <Button
                  label={"Show Results"}
                  icon="bi bi-card-list"
                  className="tw-h-10 rounded"
                  onClick={showResults}
                />
              )}
          </div>
        </div>
        {currentRound && (
          <div className="mt-3 text-muted tw-font-normal">
            <span>
              Round:&nbsp;
              <span className="dark-blue">{currentRound.number}</span>
              ,&nbsp;
            </span>
            <span>
              Start Date:&nbsp;
              <span className="dark-blue tw-underline">
                {getDateWithTime(currentRound.start_date)}
              </span>
              ,&nbsp;
            </span>
            <span>
              End Date:&nbsp;
              <span className="dark-blue tw-underline">
                {getDateWithTime(currentRound.end_date)}
              </span>
              &nbsp;
            </span>
          </div>
        )}
      </div>
    </>
  );
}
