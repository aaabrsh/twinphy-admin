import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { providers, statuses } from "../../data/data";
import { Button } from "primereact/button";

export default function UsersTableFilters({
  filterTable,
}: {
  filterTable: any;
}) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [provider, setProvider] = useState("");
  const [is_complete, setIsComplete] = useState("");
  const [status, setStatus] = useState("");

  const clearFilters = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setWhatsapp("");
    setProvider("");
    setIsComplete("");
    setIsComplete("");
    setStatus("");

    filterTable()
  };

  const onFilterClick = () => {
    const query: any = {};
    if (first_name) {
      query.first_name = first_name;
    }

    if (last_name) {
      query.last_name = last_name;
    }

    if (email) {
      query.email = email;
    }

    if (whatsapp) {
      query.whatsapp = whatsapp;
    }

    if (provider) {
      query.provider = provider;
    }

    if (is_complete) {
      query.is_complete = is_complete;
    }

    if (status) {
      query.status = status;
    }

    if (Object.keys(query).length > 0) filterTable(query);
  };

  return (
    <>
      <div className="tw-flex tw-flex-wrap tw-gap-3 tw-font-normal">
        {/* First Name */}
        <span className="p-float-label tw-mt-5">
          <InputText
            id="first_name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className={first_name ? "tw-border-[#4154f1]" : ""}
          />
          <label htmlFor="first_name">First Name</label>
        </span>

        {/* Last Name */}
        <span className="p-float-label tw-mt-5">
          <InputText
            id="last_name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className={last_name ? "tw-border-[#4154f1]" : ""}
          />
          <label htmlFor="last_name">Last Name</label>
        </span>

        {/* Email */}
        <span className="p-float-label tw-mt-5">
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={email ? "tw-border-[#4154f1]" : ""}
          />
          <label htmlFor="email">Email</label>
        </span>

        {/* Whatsapp */}
        <span className="p-float-label tw-mt-5">
          <InputText
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={whatsapp ? "tw-border-[#4154f1]" : ""}
          />
          <label htmlFor="whatsapp">WhatsApp</label>
        </span>

        {/* Provider */}
        <span className="p-float-label tw-mt-5">
          <Dropdown
            inputId="provider"
            value={provider}
            onChange={(e) => setProvider(e.value)}
            options={providers}
            className={`tw-min-w-[200px] ${
              provider ? "tw-border-[#4154f1]" : ""
            }`}
            showClear
          />
          <label htmlFor="provider">Profile Provider</label>
        </span>

        {/* Provider */}
        <span className="p-float-label tw-mt-5">
          <Dropdown
            inputId="isComplete"
            value={is_complete}
            onChange={(e) => setIsComplete(e.value)}
            options={["true", "false"]}
            className={`tw-min-w-[200px] ${
              is_complete ? "tw-border-[#4154f1]" : ""
            }`}
            showClear
          />
          <label htmlFor="isComplete">Profile Completion</label>
        </span>

        {/* Status */}
        <span className="p-float-label tw-mt-5">
          <Dropdown
            inputId="status"
            value={status}
            onChange={(e) => setStatus(e.value)}
            options={statuses}
            className={`tw-min-w-[200px] ${
              status ? "tw-border-[#4154f1]" : ""
            }`}
            showClear
          />
          <label htmlFor="isComplete">Status</label>
        </span>

        <div className="tw-flex tw-items-center tw-gap-2 tw-mt-5">
          <Button
            label="Filter"
            icon="bi bi-funnel"
            className="tw-h-10 rounded"
            onClick={onFilterClick}
          />
          <Button
            label="Clear"
            severity="secondary"
            icon="bi bi-x-lg"
            className="tw-h-10 rounded"
            onClick={clearFilters}
          />
        </div>
      </div>
    </>
  );
}
