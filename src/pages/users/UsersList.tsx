import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { profileTemplate } from "./components/ui/ProfileTemplate";
import { profileProviderTemplate } from "./components/ui/ProfileProviderTemplate";
import { statusBodyTemplate } from "./components/ui/StatusBodyTemplate";
import { profileCompletionTemplate } from "./components/ui/ProfileCompletionTemplate";
import UsersTableFilters from "./components/container/UsersTableFilters";
import { statuses } from "./data/data";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";

export default function UsersList() {
  const [tableLoading, setTableLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState<any>();
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page, limit, {});
  }, []);

  const filterTable = (query: any) => {
    setQuery(query);
    fetchUsers(0, limit, query);
  };

  const fetchUsers = (page: number, limit: number, query: any) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
    };

    if (query) queryParams = { ...queryParams, ...query };

    setTableLoading(true);
    get("user/list", queryParams)
      .then((res) => {
        setUsers(res.data);
        setPage(res.page);
        setTotal(res.total);
        setLimit(res.limit);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error! couldn't load users");
        setTableLoading(false);
      });
  };

  const onPageChange = (event: any) => {
    fetchUsers(event.page, event.rows, query);
  };

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
            navigate("/user/" + selectedUser.username);
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
              setNewStatus(null);
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
    if (!newStatus) {
      return;
    }
    setTableLoading(true);
    create("user/status", { id: selectedUser._id, status: newStatus })
      .then((res) => {
        updateState(res.data);
        setTableLoading(false);
        toast.success(res.message);
      })
      .catch((e) => {
        console.log(e);
        setTableLoading(false);
        toast.error(e.response?.data?.message);
      });
    setShowModal(false);
  };

  const updateState = (newState: any) => {
    const usersCopy = users.map((user) => {
      if (user._id === newState._id) {
        user = newState;
      }
      return user;
    });

    setUsers(usersCopy);
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
        rows={limit}
        totalRecords={total}
        lazy={true}
        first={(page - 1) * limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPage={onPageChange}
        header={<UsersTableFilters filterTable={filterTable} />}
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
        <Column
          field="username"
          header="Username"
          body={(data) => (
            <Link to={"/user/" + data.username}>@{data.username}</Link>
          )}
          sortable
        ></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="contact_no" header="Contact Number" sortable></Column>
        <Column
          header="Profile Provider"
          body={profileProviderTemplate}
          sortable
        ></Column>
        <Column
          header="Profile Completion"
          body={profileCompletionTemplate}
          sortable
        ></Column>
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
        ></Column>
        <Column
          field="createdAt"
          header="Joined In"
          body={(row) => dateTemplate(row.createdAt)}
          sortable
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
