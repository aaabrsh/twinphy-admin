import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostsContainer from "./components/container/PostsContainer";
import { usePostStore } from "../../store/store";
import { get } from "../../services/api";
import { Skeleton } from "primereact/skeleton";
import { toast } from "react-toastify";

export default function Post() {
  const posts = usePostStore((state) => state.posts);
  const addToFeed = usePostStore((state) => state.addToFeed);
  const clearPosts = usePostStore((state) => state.clearPosts);
  const [pageLoading, setPageLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    fetchPost();

    return () => {
      clearPosts();
    };
  }, []);

  const fetchPost = () => {
    get("post/" + params.postId)
      .then((res) => {
        addToFeed([res.data]);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e?.response?.data?.message ?? "Error! Post Not Found");
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    return (
      <div className="tw-w-full">
        <div className="tw-flex tw-gap-3">
          <Skeleton className="tw-block !tw-w-[50px] !tw-h-[50px] tw-rounded-[50%]" />
          <div className="tw-flex tw-items-start tw-justify-center tw-gap-2 tw-flex-col">
            <Skeleton className="!tw-w-[200px]" />
            <Skeleton className="!tw-w-[70px]" />
          </div>
        </div>
        <div className="tw-flex tw-mt-4 tw-gap-5 tw-h-[400px]">
          <Skeleton className="!tw-h-full !tw-w-full !md:tw-w-[70%]" />
          <Skeleton className="!tw-h-full !tw-w-[30%] tw-hidden md:tw-block" />
        </div>
      </div>
    );
  }

  if (posts.length < 1) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-flex-col tw-bg-zinc-200 tw-rounded-2xl tw-w-full">
        <img
          src="/assets/img/not-found.svg"
          className="img-fluid py-5"
          style={{ width: "300px", height: "300px" }}
        />
        <span className="dark-blue tw-opacity-80 tw-pb-10 tw-font-bold tw-text-3xl">
          No Post Found
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="tw-w-full">
        <PostsContainer feed={posts} />
      </div>
    </>
  );
}
