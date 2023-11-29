import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Column } from "primereact/column";
import { profileTemplate } from "../users/components/ui/ProfileTemplate";
import { getDate } from "../../utils/time";
import { Menu } from "primereact/menu";
import TruncatedText from "../../components/TurncatedText";
import { get } from "../../services/api";
import { toast } from "react-toastify";

export default function Competitors() {
  const [tableLoading, setTableLoading] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [selectedUser, setSelecteduser] = useState<any>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const actionBtnRef = useRef<any>();
  const navigate = useNavigate();
  const params = useParams();

  const items = [
    {
      label: "Navigate",
      items: [
        {
          label: "View Post",
          icon: "bi bi-collection-play-fill",
          command: () => {
            navigate(
              "/user/" +
                selectedUser.author.username +
                "/post/" +
                selectedUser._id
            );
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchPosts(0, limit);
  }, []);

  const fetchPosts = (page: number, limit: number) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
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
    fetchPosts(event.page, event.rows);
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
        selectionMode="single"
        emptyMessage="No posts found."
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          header="Name"
          body={(rowData) => profileTemplate(rowData.user)}
          sortable
          sortField="user.first_name"
        ></Column>
        <Column field="status" header="Status" sortable></Column>
        <Column field="likes_count" header="Post Likes" sortable></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>
    </div>
  );
}
