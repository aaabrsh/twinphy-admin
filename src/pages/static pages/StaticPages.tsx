import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import { Skeleton } from "primereact/skeleton";

export default function StaticPages({ pageKey }: { pageKey: string }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPageContents();
  }, [pageKey]);

  const fetchPageContents = () => {
    setLoading(true);
    get("static-pages/" + pageKey)
      .then((res) => {
        setValue(res.data?.content);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't get page contents"
        );
        setLoading(false);
      });
  };

  const updatePage = () => {
    create("static-pages/create", { pagename: pageKey, content: value })
      .then((_) => {
        toast.success("page updated successfully");
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update page contents"
        );
      });
  };

  if (loading) {
    return <Skeleton className="!tw-h-96" />;
  }

  return (
    <>
      <div>
        <ReactQuill theme="snow" value={value} onChange={setValue} />
      </div>
      <div className="tw-flex tw-justify-end tw-p-2">
        <button
          className="btn btn-primary"
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
          onClick={updatePage}
        >
          Save
        </button>
      </div>
    </>
  );
}
