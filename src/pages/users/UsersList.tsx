import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { dummydata } from "./dummy_data";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { profileTemplate } from "./components/ui/ProfileTemplate";
import { profileProviderTemplate } from "./components/ui/ProfileProviderTemplate";
import {
  statusBodyTemplate,
  statusFilterTemplate,
  statuses,
} from "./components/ui/StatusBodyTemplate";
import { profileCompletionTemplate } from "./components/ui/ProfileCompletionTemplate";
import SearchHeader from "../../components/SearchHeader";

export default function UsersList() {
  const [tableLoading, setTableLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [rowsNum, setRowsNum] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(dummydata);
  }, []);

  const dateTemplate = (dateStr: string) => {
    return <>{getDate(dateStr)}</>;
  };

  const actionRef = useRef<any>();

  const items = [
    {
      label: "Options",
      items: [
        {
          label: "Change Status",
          icon: "bi bi-gear-fill",
          command: () => {
            setShowModal(true);
          },
        },
      ],
    },
    {
      label: "Navigate",
      items: [
        {
          label: "View Profile",
          icon: "bi bi-person-circle",
          command: () => {
            navigate("/user/" + selectedUser._id);
          },
        },
      ],
    },
  ];

  const actionButtons = (rowData: any) => {
    return (
      <>
        <div>
          <Menu model={items} popup ref={actionRef} className="" />
          <button
            className="btn btn-primary btn-sm tw-w-[75px] !tw-py-1"
            onClick={(event) => {
              setSelectedUser(rowData);
              actionRef.current.toggle(event);
            }}
          >
            <i className="bi bi-arrow-down-circle tw-mr-1"></i>
            <span>Actions</span>
          </button>
        </div>
      </>
    );
  };

  const saveNewStatus = () => {
    console.log(newStatus);
    setShowModal(false);
  };

  const clearNewStatus = () => {
    setNewStatus(null);
    setShowModal(false);
  };

  const footerContent = (
    <div>
      <button onClick={clearNewStatus} className="btn btn-secondary me-3">
        Cancel
      </button>
      <button onClick={saveNewStatus} className="btn btn-primary">
        Save
      </button>
    </div>
  );

  return (
    <div className="card">
      {/* Table */}

      <DataTable
        loading={tableLoading}
        value={users}
        paginator
        rows={rowsNum}
        header={
          <SearchHeader
            text={searchInput}
            textChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        }
        selectionMode="single"
        emptyMessage="No users found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="profile_img"
          header="Profile"
          body={profileTemplate}
          sortable
          sortField="first_name"
        ></Column>
        <Column field="email" header="email" sortable></Column>
        <Column field="whatsapp" header="whatsapp" sortable></Column>
        <Column
          header="Profile Provider"
          body={profileProviderTemplate}
          sortable
          filter
          filterElement={statusFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
        ></Column>
        <Column
          header="Profile Completion"
          body={profileCompletionTemplate}
          sortable
          filter
          filterElement={statusFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
          filter
          filterElement={statusFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
        ></Column>
        <Column
          field="createdAt"
          header="Joined In"
          body={(row) => dateTemplate(row.createdAt)}
          sortable
          filter
          filterElement={statusFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>

      {/* Modal */}
      <Dialog
        header="Change Account Status"
        visible={showModal}
        onHide={clearNewStatus}
        position="top"
        style={{ width: "50vw" }}
        footer={footerContent}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <Dropdown
          value={newStatus}
          onChange={(e) => setNewStatus(e.value)}
          options={statuses}
          placeholder="Set Status"
          className="tw-w-full tw-z-[9999]"
        />
      </Dialog>
    </div>
  );
}
