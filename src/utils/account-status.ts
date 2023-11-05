export const getStatusSeverity = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "suspended":
      return "warning";
    case "under review":
      return "info";
    case "deleted":
      return "danger";
    default:
      return "";
  }
};
