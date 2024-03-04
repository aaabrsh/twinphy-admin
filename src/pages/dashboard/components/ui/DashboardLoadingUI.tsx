import { Skeleton } from "primereact/skeleton";

export default function DashboardLoadingUI() {
  return (
    <div className="tw-flex tw-flex-col gap-5">
      <div className="row">
        <div className="col-xxl-4 col-md-4 col-sm-6">
          <Skeleton className="!tw-h-[150px]"></Skeleton>
        </div>
        <div className="col-xxl-4 col-md-4 col-sm-6">
          <Skeleton className="!tw-h-[150px]"></Skeleton>
        </div>
        <div className="col-xxl-4 col-md-4 col-sm-6">
          <Skeleton className="!tw-h-[150px]"></Skeleton>
        </div>
      </div>

      <div className="row mx-2">
        <Skeleton className="!tw-h-[250px]"></Skeleton>
      </div>

      <div className="row mx-2">
        <Skeleton className="!tw-h-[250px]"></Skeleton>
      </div>
    </div>
  );
}
