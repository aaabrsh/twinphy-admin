import { formatResourceURL } from "../../../../utils/asset-paths";
import { formatNumber } from "../../../../utils/number-formatting";

export default function PostUI({ post }: { post: any }) {
  return (
    <>
      <div className="tw-h-full">
        <p className="text-black tw-pt-4 tw-text-justify">{post.caption}</p>
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
              src={formatResourceURL(post.media?.[0]?.filename)}
              alt="/"
            />
          )}
          {post.media?.[0]?.type === "video" && (
            <video
              poster={
                post.media?.[0]?.thumbnail?.filename
                  ? formatResourceURL(post.media?.[0]?.thumbnail?.filename)
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
                src={formatResourceURL(post.media?.[0]?.filename)}
                type={post.media?.[0]?.contentType}
              />
            </video>
          )}
          <div className="">
            <div className="tw-flex tw-gap-2 tw-py-2">
              <div className="tw-flex tw-justify-center tw-items-center tw-rounded-2xl tw-h-7 tw-px-4 tw-min-w-[50px] tw-bg-orange-200">
                <i className="bi bi-heart-fill tw-text-orange-600"></i>
                <div className="font-14 mb-0 ms-2" id="value1">
                  {formatNumber(post.likes_count ?? 0)}
                </div>
              </div>
              <div className="tw-flex tw-justify-center tw-items-center tw-rounded-2xl tw-h-7 tw-px-4 tw-min-w-[50px] tw-bg-teal-200">
                <i className="bi bi-chat-fill tw-text-teal-600"></i>
                <div className="font-14 mb-0 ms-2">
                  {formatNumber(post.comments_count ?? 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
