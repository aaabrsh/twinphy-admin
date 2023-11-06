import { useNavigate } from "react-router-dom";
import timeAgo from "../../../../utils/time";
import { env } from "../../../../utils/env";

export default function PostUI({
  post,
  toggleComment,
  togglePostLike,
}: {
  post: any;
  toggleComment: (id: string) => void;
  togglePostLike: (id: string, liked: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="post-card">
        <div className="top-meta">
          <div className="d-flex justify-content-between align-items-start">
            <a
              onClick={() => navigate("/profile/" + post.author._id)}
              className="media media-40"
              style={{ cursor: "pointer" }}
            >
              {/* TODO: add default profile image incase profile image doesn't exist */}
              <img className="rounded" src={post.author?.profile_img} alt="/" />
            </a>
            <div className="meta-content ms-3">
              <h6 className="title mb-0">
                <a
                  onClick={() => navigate("/profile/" + post.author._id)}
                  style={{ cursor: "pointer" }}
                >
                  {post.author?.first_name + " " + post.author?.last_name}
                </a>
              </h6>
              <ul className="meta-list">
                <li>{timeAgo(post.createdAt)}</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-black">{post.caption}</p>
        <div className="dz-media">
          {post.media?.[0]?.type === "image" && (
            <img
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "auto",
                minHeight: "200px",
                maxHeight: "600px",
                objectFit: "contain",
              }}
              src={`${env.VITE_API_URL}/media/${post.media?.[0]?.filename}`}
              alt="/"
            />
          )}
          {post.media?.[0]?.type === "video" && (
            <video
              poster={
                post.media?.[0]?.thumbnail?.filename
                  ? `${env.VITE_API_URL}/media/${post.media?.[0]?.thumbnail?.filename}`
                  : undefined
              }
              id="videoPlayer"
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "auto",
                minHeight: "200px",
                maxHeight: "600px",
                objectFit: "contain",
              }}
              controls
            >
              <source
                src={`${env.VITE_API_URL}/media/${post.media?.[0]?.filename}`}
                type={post.media?.[0]?.contentType}
              />
            </video>
          )}
          {/* <img src="/assets/images/post/pic1.png" alt="/" /> */}
          <div className="post-meta-btn">
            <ul>
              <li>
                <a
                  onClick={() =>
                    togglePostLike(post._id, !(post?.likes?.length > 0))
                  }
                  className={`action-btn bg-primary ${
                    post?.likes?.length > 0 ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-heart fill-icon"></i>
                  <i className="fa-solid fa-heart fill-icon-2"></i>
                  <h6 className="font-14 mb-0 ms-2" id="value1">
                    {post.likes_count ?? 0}
                  </h6>
                </a>
              </li>
              <li>
                <a
                  onClick={() => toggleComment(post._id)}
                  className="action-btn bg-secondary"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-comment fill-icon"></i>
                  <h6 className="font-14 mb-0 ms-2">
                    {post.comments_count ?? 0}
                  </h6>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
