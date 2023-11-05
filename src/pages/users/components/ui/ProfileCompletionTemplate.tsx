import { AccountCompletion } from "../../../../components/Tags";

export const profileCompletionTemplate = (rowData: any) => {
  let data = rowData.is_complete.toString();
  return <AccountCompletion is_complete={data} />;
};
