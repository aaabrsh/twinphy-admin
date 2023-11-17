import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { profileTemplate } from "../users/components/ui/ProfileTemplate";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import TruncatedText from "../../components/TurncatedText";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import ReportTypesSelector from "./components/ui/ReportTypesSelector";

export default function Reported() {
  const [tableLoading, setTableLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [status, setStatus] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState<any>({ status: "pending" });
  const [newStatus, setNewStatus] = useState<"resolved" | "ignored">();
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
            setNewStatus("resolved");
            setShowModal(true);
          },
        },
        {
          label: "Ignore Report",
          icon: "bi bi-check-circle",
          command: () => {
            setNewStatus("ignored");
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
                selectedReport.reported_by.username +
                "/post/" +
                selectedReport.post
            );
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchReports(0, limit, query);
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
        toast.error(
          e.response?.data?.message ?? "Error! couldn't load reported posts"
        );
        setTableLoading(false);
      });
  };

  const onPageChange = (event: any) => {
    fetchReports(event.page, event.rows, query);
  };

  const setFilter = (status: string) => {
    if (status) {
      setStatus(status);
      setQuery({ status });
      fetchReports(0, limit, { status: status });
    }
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
    switch (newStatus) {
      case "resolved":
        resolveReport(selectedReport._id);
        break;
      case "ignored":
        ignoreReport(selectedReport._id);
        break;
    }
    closeDialog();
  };

  const resolveReport = (id: string) => {
    setTableLoading(true);
    create("report/remove/" + id, {})
      .then((res) => {
        toast.success(res.message);
        removeReport(selectedReport._id);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! failed to remove post"
        );
        setTableLoading(false);
      });
  };

  const ignoreReport = (id: string) => {
    setTableLoading(true);
    create("report/ignore/" + id, {})
      .then((res) => {
        toast.success(res.message);
        removeReport(selectedReport._id);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! failed to update report"
        );
        setTableLoading(false);
      });
  };

  const removeReport = (id: string) => {
    const reportsCopy: any = [];

    for (let i = 0; i < reports.length; i++) {
      if (reports[i]._id !== id) {
        reportsCopy.push(reports[i]);
      }
    }

    setReports(reportsCopy);
    setSelectedReport(null);
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
        header={<ReportTypesSelector status={status} setFilter={setFilter} />}
        selectionMode="single"
        emptyMessage="No reports found."
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
        <Column field="status" header="Status" sortable></Column>
        <Column
          field="createdAt"
          header="Reported On"
          body={(row) => getDate(row.createdAt)}
          sortable
        ></Column>
        {status === "pending" && (
          <Column header="Actions" body={actionButtons}></Column>
        )}
      </DataTable>

      {/* Modal */}
      <ConfirmationDialog
        show={showModal}
        header={
          newStatus === "resolved"
            ? "Do you want to remove the reported post"
            : "Would you like to take no action on the reported post"
        }
        onClose={closeDialog}
        onConfirmed={dialogConfirmed}
      />
    </div>
  );
}
