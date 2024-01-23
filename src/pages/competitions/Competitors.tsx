import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Column } from "primereact/column";
import { profileTemplate } from "../users/components/ui/ProfileTemplate";
import { Menu } from "primereact/menu";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import CompetitorTableHeader from "./components/container/CompetitorTableHeader";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { getDate_0_indexed } from "../../utils/time";

export default function Competitors() {
  const [tableLoading, setTableLoading] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [selectedUser, setSelecteduser] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rounds, setRounds] = useState<any>([]);
  const [currentRound, setCurrentRound] = useState<any>();
  const [competitionInfo, setCompetitionInfo] = useState<any>();
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const actionBtnRef = useRef<any>();
  const navigate = useNavigate();
  const params = useParams();

  const getActionButtonItems = (selectedUser: any) => {
    const items: any[] = [];

    if (selectedUser) {
      if (selectedUser.status === "playing") {
        items.push({
          label: "Options",
          items: [
            {
              label: "Remove User",
              icon: "bi bi-dash-circle",
              command: () => {
                setShowReasonModal(true);
              },
            },
          ],
        });
      }

      if (selectedUser.post?._id) {
        items.push({
          label: "Navigate",
          items: [
            {
              label: "View Post",
              icon: "bi bi-collection-play-fill",
              command: () => {
                navigate(
                  "/user/" +
                    selectedUser.user.username +
                    "/post/" +
                    selectedUser.post?._id
                );
              },
            },
          ],
        });
      }
    }

    if (items.length === 0) {
      return [{ label: "No Actions Available" }];
    }
    return items;
  };

  const items = getActionButtonItems(selectedUser);

  useEffect(() => {
    fetchPosts(0, limit, 1);
    fetchRounds(params.id ?? "");
  }, []);

  const fetchPosts = (page: number, limit: number, round: number) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
      round,
    };

    setTableLoading(true);
    get("competition/user/list/" + params.id, queryParams)
      .then((res) => {
        setCompetitors(res.data);
        setPage(res.page);
        setTotal(res.total);
        setLimit(res.limit);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response?.data?.message ?? "Error! couldn't load posts");
        setTableLoading(false);
      });
  };

  const onPageChange = (event: any) => {
    fetchPosts(event.page, event.rows, currentRound.number);
  };

  const actionButtons = (rowData: any) => {
    return (
      <>
        <div>
          <Menu model={items} popup ref={actionBtnRef} className="" />
          <button
            className="btn btn-primary btn-sm tw-w-[75px] !tw-py-1"
            onClick={(event) => {
              setSelecteduser(rowData);
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

  const getCompetitorStatusBadge = (rowData: any) => {
    switch (rowData?.status) {
      case "playing":
        if (rowData?.competition?.status === "scheduled") {
          return <span className="badge bg-warning">Joined</span>;
        } else {
          return <span className="badge bg-primary">Playing</span>;
        }
      case "won":
        return <span className="badge bg-success">Won</span>;
      case "lost":
        return <span className="badge bg-secondary">Lost</span>;
      case "removed":
        return <span className="badge bg-danger">Removed</span>;
      case "left":
        return <span className="badge bg-dark">Left</span>;
    }
  };

  const fetchRounds = (competitionId: string) => {
    get("competition/admin/rounds/" + competitionId)
      .then((res) => {
        const rounds = res.data?.map((round: any) => ({
          ...round,
        }));
        setRounds(rounds);
        setCurrentRound(rounds[0] ?? {});
        setCompetitionInfo(rounds[0]?.competition);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load rounds"
        );
      });
  };

  const roundChanged = (round: any) => {
    setCurrentRound(round);
    fetchPosts(0, limit, round.number);
  };

  const advanceRound = () => {
    setTableLoading(true);
    create("competition/advance/" + params.id, {})
      .then(() => {
        fetchPosts(0, limit, 1);
        fetchRounds(params.id ?? "");
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't change rounds"
        );
        setTableLoading(false);
      });
  };

  const showResults = () => {
    setTableLoading(true);

    create("competition/show-results/" + params.id, {
      result_date: getDate_0_indexed(new Date()),
    })
      .then(() => {
        fetchPosts(0, limit, 1);
        fetchRounds(params.id ?? "");
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't change result date"
        );
        setTableLoading(false);
      });
  };

  const closeReasonModal = () => {
    setShowReasonModal(false);
    setReason("");
    setReasonError("");
  };

  const removeUser = () => {
    if (!reason) {
      return setReasonError("reason is required");
    } else {
      setReasonError("");
    }

    if (selectedUser?.user) {
      setTableLoading(true);
      closeReasonModal();
      create("/competition/" + params.id + "/remove/" + selectedUser.user._id, {
        reason,
      })
        .then((res) => {
          fetchPosts(page, limit, currentRound.number);
          toast.success(res?.data?.message ?? "user removed from competition");
        })
        .catch((e) => {
          console.log(e);
          toast.error(
            e?.response?.data?.message ?? "Error! couldn't remove user"
          );
        });
    }
  };

  const footerContent = (
    <div>
      <button onClick={closeReasonModal} className="btn btn-secondary me-3">
        Cancel
      </button>
      <button onClick={removeUser} className="btn btn-primary">
        Save
      </button>
    </div>
  );

  return (
    <div className="card">
      {/* Table */}
      <DataTable
        loading={tableLoading}
        value={competitors}
        paginator
        rows={limit}
        totalRecords={total}
        lazy={true}
        first={(page - 1) * limit}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPage={onPageChange}
        header={
          <CompetitorTableHeader
            rounds={rounds}
            competitionInfo={competitionInfo}
            currentRound={currentRound}
            roundChanged={roundChanged}
            advanceRound={advanceRound}
            showResults={showResults}
          />
        }
        selectionMode="single"
        emptyMessage="No posts found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          header="Name"
          body={(rowData) => profileTemplate(rowData.user)}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={(rowData) => getCompetitorStatusBadge(rowData)}
          sortable
        ></Column>
        <Column
          header="Post Likes"
          sortable
          body={(rowData) => <>{rowData.post?.likes_count ?? "No Post"}</>}
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>

      {/* Modal */}
      <Dialog
        header="Give Reason To Remove User"
        visible={showReasonModal}
        onHide={closeReasonModal}
        position="top"
        style={{ width: "50vw" }}
        footer={footerContent}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <div className="">
          <span className="p-float-label tw-mt-5">
            <InputTextarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className={`tw-w-full ${reasonError ? "p-invalid" : ""}`}
              autoFocus
            />
            <label htmlFor="reason">Reason</label>
          </span>
          {reasonError && (
            <small className="tw-text-red-500">{reasonError}</small>
          )}
        </div>
      </Dialog>
    </div>
  );
}
