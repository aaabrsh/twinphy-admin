import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { Tag } from "../../../../components/Tags";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

export const statuses: string[] = ["active", "suspended", "under review", "deleted"];

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

export const statusBodyTemplate = (rowData: any) => {
  return (
    <Tag children={rowData.status} type={getStatusSeverity(rowData.status)} />
  );
};

export const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
  return (
    <Dropdown
      value={options.value}
      options={statuses}
      onChange={(e: DropdownChangeEvent) =>
        options.filterCallback(e.value, options.index)
      }
      itemTemplate={statusItemTemplate}
      placeholder="Select One"
      className="p-column-filter"
      showClear
    />
  );
};

export const statusItemTemplate = (option: string) => {
  return <Tag children={option} type={getStatusSeverity(option)} />;
};
