import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "../../components/SearchHeader";
import { Column } from "primereact/column";
import { profileTemplate } from "../users/components/ui/ProfileTemplate";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import TruncatedText from "../../components/TurncatedText";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { get } from "../../services/api";
import { toast } from "react-toastify";

export default function Reported() {
  const [tableLoading, setTableLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState<any>();
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
    fetchReports(0, limit);
  }, []);

  const fetchReports = (page: number, limit: number, query?: any) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
    };
    if (query) queryParams = { ...queryParams, ...query };

    setTableLoading(true);
    get("report", queryParams)
      .then((res) => {
        setReports(res.data);
        setPage(res.page);
        setTotal(res.totalCount);
        setLimit(res.limit);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error! couldn't load reported posts");
        setTableLoading(false);
      });
  };

  const onPageChange = (event: any) => {
    fetchReports(event.page, event.rows, query);
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
        rows={limit}
        totalRecords={total}
        lazy={true}
        first={(page - 1) * limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPage={onPageChange}
        header={
          // TODO: header should be buttons for ignored, resolved and pending reports
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
