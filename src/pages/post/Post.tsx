import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostsContainer from "./components/container/PostsContainer";
import { usePostStore } from "../../store/store";
import { get } from "../../services/api";

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
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    // return <PageLoading />;
    // TODO:
    return <>Show Skeleton Loading</>;
  }

  return (
    <>
      <div className="tw-w-full">
        <PostsContainer feed={posts} />
      </div>
    </>
  );
}
