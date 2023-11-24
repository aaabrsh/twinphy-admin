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

export default function CompetitionPosts() {
  const [tableLoading, setTableLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
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
          label: "View Post ",
          icon: "bi bi-collection-play-fill",
          command: () => {
            navigate(
              "/user/" +
                selectedPost.reported_by.username +
                "/post/" +
                selectedPost.post
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
    get("competition/post/list/" + params.id, queryParams)
      .then((res) => {
        setPosts(res.data);
        setPage(res.page);
        setTotal(res.totalCount);
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
              setSelectedPost(rowData);
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
        value={posts}
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
          header="Post By"
          body={(rowData) => profileTemplate(rowData.author)}
          sortable
          sortField="first_name"
        ></Column>
        <Column
          field="caption"
          header="Caption"
          body={(rowData: any) => (
            <TruncatedText text={rowData.comment} maxLength={100} />
          )}
          sortable
        ></Column>
        <Column field="likes_count" header="Likes" sortable></Column>
        <Column field="comments_count" header="Comments" sortable></Column>
        <Column
          field="createdAt"
          header="Posted On"
          body={(row) => getDate(row.createdAt)}
          sortable
        ></Column>
        <Column header="Actions" body={actionButtons}></Column>
      </DataTable>
    </div>
  );
}
