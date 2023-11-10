import { formatResourceURL, handleProfileImageError } from "../../../../utils/asset-paths";
import { getName } from "../../../../utils/getName";

export const profileTemplate = (rowData: any) => {
  return (
    <div className="flex align-items-center gap-2">
      <img
        alt=""
        src={formatResourceURL(rowData.profile_img + "as")}
        onError={handleProfileImageError}
        className="tw-w-[32px] tw-h-[32px] tw-rounded-[50%] tw-mb-2 tw-block"
      />
      <span>{getName(rowData)}</span>
    </div>
  );
};
