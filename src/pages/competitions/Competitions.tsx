import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import { handleCompetitionImageError } from "../../utils/asset-paths";
import { getDate } from "../../utils/time";
import TruncatedText from "../../components/TurncatedText";
import { Menu } from "primereact/menu";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import CompetitionStatusSelector from "./components/ui/CompetitionStatusSelector";
import { Competition } from "./data";
import { Dialog } from "primereact/dialog";
import CompetitionForm from "./components/container/CompetitionForm";

export default function Competitions() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<"scheduled" | "started" | "ended">(
    "scheduled"
  );
  const [newStatus, setNewStatus] = useState<"started" | "ended">();
  const [query, setQuery] = useState<any>({ status: "scheduled" });
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);
  const [showCompetitionFormModal, setShowCompetitionFormModal] =
    useState(false);

  const actionBtnRef = useRef<any>();
  const navigate = useNavigate();

  const actionItems: any[] = [
    (status === "scheduled" || status === "started") && {
      label: "Options",
      items: [
        status === "scheduled"
          ? {
              label: "Start Competition",
              icon: "bi play-circle",
              command: () => {
                setNewStatus("started");
                setShowModal(true);
              },
            }
          : {
              label: "End Competition",
              icon: "bi stop-circle",
              command: () => {
                setNewStatus("ended");
                setShowModal(true);
              },
            },
      ],
    },
    {
      label: "Navigate",
      items: [
        {
          label: "View Posts",
          icon: "bi bi-collection-play-fill",
          command: () => {
            navigate("/competition/" + selectedCompetition._id + "/posts");
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchCompetitions(0, limit, query);
  }, []);

  const fetchCompetitions = (page: number, limit: number, query?: any) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
    };

    if (query) queryParams = { ...queryParams, ...query };

    setTableLoading(true);
    get("competition/admin/list", queryParams)
      .then((res) => {
        setCompetitions(res.data);
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

  const setFilter = (status: "scheduled" | "started" | "ended") => {
    if (status) {
      setStatus(status);
      setQuery({ status });
      fetchCompetitions(0, limit, { status: status });
    }
  };

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={rowData.image}
        onError={handleCompetitionImageError}
        className="w-6rem shadow-2 border-round"
      />
    );
  };

  const paymentAmountTemplate = (rowData: any) => {
    if (rowData.is_paid) {
      return <div>Free</div>;
    } else {
      return <div>{rowData.amount}$</div>;
    }
  };

  const onPageChange = (event: any) => {
    fetchCompetitions(event.page, event.rows);
  };

  const actionButtons = (rowData: any) => {
    return (
      <>
        <div>
          <Menu model={actionItems} popup ref={actionBtnRef} className="" />
          <button
            className="btn btn-primary btn-sm tw-w-[75px] !tw-py-1"
            onClick={(event) => {
              setSelectedCompetition(rowData);
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
    setSelectedCompetition(null);
    setShowModal(false);
  };

  const dialogConfirmed = () => {
    switch (newStatus) {
      case "started":
        updateCompetitionStatus(selectedCompetition._id, "started");
        break;
      case "ended":
        updateCompetitionStatus(selectedCompetition._id, "ended");
        break;
    }
    closeDialog();
  };

  const updateCompetitionStatus = (id: string, status: "started" | "ended") => {
    let url = `competition/${status === "started" ? "start" : "end"}/${id}`;
    setTableLoading(true);
    create(url, {})
      .then((res) => {
        toast.success(res.message ?? "competition status updated");
        fetchCompetitions(0, limit, { status: status });
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! failed to remove post"
        );
        setTableLoading(false);
      });
  };

  const openCompetitionFormModal = () => {
    setShowCompetitionFormModal(true);
  };

  const closeCompetitionFormModal = () => {
    setShowCompetitionFormModal(false);
  };

  const createCompetition = (data: Competition) => {
    console.log(data);
  };

  return (
    <div className="card">
      <DataTable
        loading={tableLoading}
        value={competitions}
        paginator
        rows={limit}
        totalRecords={total}
        lazy={true}
        first={(page - 1) * limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPage={onPageChange}
        header={
          <CompetitionStatusSelector
            status={status}
            setFilter={setFilter}
            newCompetitionClicked={openCompetitionFormModal}
          />
        }
        emptyMessage="No competitions found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column header="Image" body={imageBodyTemplate}></Column>
        <Column field="name" header="Name" sortable sortField="name"></Column>
        <Column
          field="comment"
          header="Comment"
          body={(rowData: any) => (
            <TruncatedText text={rowData.description} maxLength={100} />
          )}
          sortable
        ></Column>
        <Column
          field="start_date"
          header="Start Date"
          sortable
          body={(row) => getDate(row.start_date)}
        ></Column>
        <Column
          field="end_date"
          header="End Date"
          sortable
          body={(row) => getDate(row.end_date)}
        ></Column>
        <Column field="status" header="Status" sortable></Column>
        <Column
          header="Payment Amount"
          body={paymentAmountTemplate}
          sortable
          sortField="amount"
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>

      {/* Modal */}
      <ConfirmationDialog
        show={showModal}
        header={
          newStatus === "started"
            ? "Do you want to start this competition now?"
            : "Do you want to stop this competition now?"
        }
        onClose={closeDialog}
        onConfirmed={dialogConfirmed}
      />

      {/* Competition Form Modal */}
      <Dialog
        header="New Competition"
        visible={showCompetitionFormModal}
        onHide={closeCompetitionFormModal}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <CompetitionForm
          onCancel={closeCompetitionFormModal}
          onSubmit={createCompetition}
        />
      </Dialog>
    </div>
  );
}
