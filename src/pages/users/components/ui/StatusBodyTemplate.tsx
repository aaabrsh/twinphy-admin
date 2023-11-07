import { ColumnFilterElementTemplateOptions } from "primereact/column";
import { Tag } from "../../../../components/Tags";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { getStatusSeverity } from "../../../../utils/account-status";
import { statuses } from "../../data/data";

export const statusBodyTemplate = (rowData: any) => {
  return (
    <Tag children={rowData.status} type={getStatusSeverity(rowData.status)} />
  );
};

export const statusFilterTemplate = (
  options: ColumnFilterElementTemplateOptions
) => {
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
