import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "../../components/SearchHeader";
import { Column } from "primereact/column";
import { profileTemplate } from "../users/components/ui/ProfileTemplate";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import { dummydata } from "./dummydata";
import TruncatedText from "../../components/TurncatedText";

export default function Reported() {
  const [tableLoading, setTableLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [rowsNum, setRowsNum] = useState(10);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const actionBtnRef = useRef<any>();
  const navigate = useNavigate();

  const items = [
    {
      label: "Options",
      items: [
        {
          label: "Remove Post",
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
          label: "View Post ",
          icon: "bi bi-collection-play-fill",
          command: () => {
            navigate(
              "/user/" +
                selectedReport.reported_by._id +
                "/post/" +
                selectedReport.post
            );
          },
        },
      ],
    },
  ];

  useEffect(() => {
    setReports(dummydata);
  }, []);

  const actionButtons = (rowData: any) => {
    return (
      <>
        <div>
          <Menu model={items} popup ref={actionBtnRef} className="" />
          <button
            className="btn btn-primary btn-sm tw-w-[75px] !tw-py-1"
            onClick={(event) => {
              setSelectedReport(rowData);
              actionBtnRef.current.toggle(event);
            }}
          >
            <i className="bi bi-arrow-down-circle tw-mr-1"></i>
            <span>Actions</span>
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="card">
      {/* Table */}

      <DataTable
        loading={tableLoading}
        value={reports}
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
          header="Reported By"
          body={(rowData) => profileTemplate(rowData.reported_by)}
          sortable
          sortField="first_name"
        ></Column>
        <Column
          field="comment"
          header="Comment"
          body={(rowData: any) => (
            <TruncatedText text={rowData.comment} maxLength={100} />
          )}
          //   body={LongTextTemplate}
          sortable
        ></Column>
        <Column
          field="createdAt"
          header="Reported On"
          body={(row) => getDate(row.createdAt)}
          sortable
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>

      {/* Modal */}
      {/* <Dialog
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
      </Dialog> */}
    </div>
  );
}
