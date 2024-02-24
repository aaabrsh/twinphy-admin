import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../utils/asset-paths";
import { Menu } from "primereact/menu";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import CompetitionStatusSelector from "./components/ui/CompetitionStatusSelector";
import { CompetitionChangedStatus, CompetitionStatus } from "./data";
import TruncatedHTML from "../../components/TurncatedHTML";
import { getDateWithTime } from "../../utils/time";

export default function Competitions() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<CompetitionStatus>("scheduled");
  const [newStatus, setNewStatus] = useState<CompetitionChangedStatus>();
  const [query, setQuery] = useState<any>({ status: "scheduled" });
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);

  const actionBtnRef = useRef<any>();
  const navigate = useNavigate();

  const getActionItemButtons = () => {
    const buttons = [];
    if (status === "scheduled") {
      buttons.push({
        label: "Start",
        icon: "bi bi-play-circle-fill",
        command: () => {
          setNewStatus("started");
          setShowModal(true);
        },
      });
    }

    if (status !== "cancelled" && status !== "ended") {
      buttons.push({
        label: "Cancel",
        icon: "bi bi-x-circle-fill",
        command: () => {
          setNewStatus("cancelled");
          setShowModal(true);
        },
      });
      buttons.push({
        label: "Edit",
        icon: "bi bi-pencil-fill",
        command: () => {
          navigate("/competition/edit/" + selectedCompetition._id);
        },
      });
    }

    return buttons;
  };

  const actionItems: any[] = [
    getActionItemButtons().length > 0 && {
      label: "Options",
      items: getActionItemButtons(),
    },
    {
      label: "Navigate",
      items: [
        {
          label: "View Competiton",
          icon: "bi bi-trophy-fill",
          command: () => {
            navigate("/competition/" + selectedCompetition._id + "/user/list");
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

  const setFilter = (status: CompetitionStatus) => {
    if (status) {
      setStatus(status);
      setQuery({ status });
      setCompetitions([]);
      fetchCompetitions(0, limit, { status: status });
    }
  };

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={formatResourceURL(rowData.image)}
        onError={handleCompetitionImageError}
        className="tw-w-40 tw-shadow-lg tw-rounded-lg"
      />
    );
  };

  const paymentAmountTemplate = (rowData: any) => {
    if (rowData.is_paid) {
      return (
        <div>
          <i className="bi bi-currency-rupee"></i>
          <span>{rowData.amount}</span>
        </div>
      );
    } else {
      return <div>Free</div>;
    }
  };

  const onPageChange = (event: any) => {
    fetchCompetitions(event.page, event.rows, query);
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
      case "cancelled":
        updateCompetitionStatus(selectedCompetition._id, "cancelled");
        break;
      // case "ended":
      //   updateCompetitionStatus(selectedCompetition._id, "ended");
      //   break;
    }
    closeDialog();
  };

  const mapStatusToAPI = (status: CompetitionChangedStatus) => {
    switch (status) {
      case "started":
        return "start";
      case "ended":
        return "end";
      case "cancelled":
        return "cancel";
    }
  };

  const updateCompetitionStatus = (
    id: string,
    status: CompetitionChangedStatus
  ) => {
    let url = `competition/${mapStatusToAPI(status)}/${id}`;
    setTableLoading(true);
    create(url, {})
      .then((res) => {
        toast.success(res.message ?? "competition status updated");
        setFilter(status);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! failed to remove post"
        );
        setTableLoading(false);
      });
  };

  const getModalMessage = (status: CompetitionChangedStatus) => {
    switch (status) {
      case "started":
        return "Do you want to start this competition now?";
      case "ended":
        return "Do you want to end this competition now?";
      case "cancelled":
        return "Do you want to cancel this competition now?";
    }
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
          <CompetitionStatusSelector status={status} setFilter={setFilter} />
        }
        emptyMessage="No competitions found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column header="Image" body={imageBodyTemplate}></Column>
        <Column field="name" header="Name" sortable sortField="name"></Column>
        <Column
          field="description"
          header="Description"
          body={(rowData: any) => (
            <TruncatedHTML text={rowData.description} maxHeight={100} />
          )}
          sortable
        ></Column>
        <Column field="current_round" header="Current Round" sortable></Column>
        <Column field="rounds_count" header="Total Rounds" sortable></Column>
        <Column field="type" header="Post Types" sortable></Column>
        <Column field="status" header="Status" sortable></Column>
        <Column
          field="start_date"
          header="Start Date"
          sortable
          body={(rowData) => getDateWithTime(rowData.start_date)}
        ></Column>
        <Column
          field="end_date"
          header="End Date"
          sortable
          body={(rowData) => getDateWithTime(rowData.end_date)}
        ></Column>
        <Column
          field="result_date"
          header="Result Date"
          sortable
          body={(rowData) => getDateWithTime(rowData.result_date)}
        ></Column>
        <Column
          header="Payment"
          body={paymentAmountTemplate}
          sortable
          sortField="amount"
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>

      {/* Modal */}
      <ConfirmationDialog
        show={showModal}
        header={() => newStatus && getModalMessage(newStatus)}
        onClose={closeDialog}
        onConfirmed={dialogConfirmed}
      />
    </div>
  );
}
