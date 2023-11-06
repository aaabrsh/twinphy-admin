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
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { get } from "../../services/api";

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
          icon: "bi bi-x-circle",
          command: () => {
            setShowModal(true);
          },
        },
        {
          label: "Ignore",
          icon: "bi bi-check-circle",
          command: () => {
            // setShowModal(true);
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
    fetchReport();
  }, []);

  const fetchReport = () => {
    // setTableLoading(true);
    // get("report")
    //   .then((res) => {
    //     // TODO: set pagination info too
    //     setReports(res.reports);
    //     setTableLoading(false);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     setTableLoading(false);
    //   });
  };

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

  const closeDialog = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  const dialogConfirmed = () => {
    console.log("remove post", selectedReport);
    closeDialog();
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
      <ConfirmationDialog
        show={showModal}
        header={"Do you want to remove the reported post"}
        onClose={closeDialog}
        onConfirmed={dialogConfirmed}
      />
    </div>
  );
}
