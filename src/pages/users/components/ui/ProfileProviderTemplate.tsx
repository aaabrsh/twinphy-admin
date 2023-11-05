import { ProfileProviders } from "../../../../components/Tags";

export const profileProviderTemplate = (rowData: any) => {
  return <ProfileProviders provider={rowData.provider} />;
};
