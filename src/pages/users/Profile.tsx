import { useEffect, useState } from "react";
import {
  AccountCompletion,
  ProfileProviders,
  Tag,
} from "../../components/Tags";
import { get } from "../../services/api";
import { getStatusSeverity } from "../../utils/account-status";
import style from "./profile.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getName } from "../../utils/getName";
import { getDate } from "../../utils/time";
import { Skeleton } from "primereact/skeleton";
import { env } from "../../utils/env";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";

export default function Profile() {
  const [profile, setProfileData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDate, setLastDate] = useState();
  const [lastPostId, setLastPostId] = useState();
  const [postsLoading, setPostsLoading] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (params.userId) {
      fetchProfileInfo(params.userId);
      fetchPosts();
    }
  }, []);

  const fetchProfileInfo = (id: string) => {
    get("user/profileInfo/" + id)
      .then((res) => {
        setProfileData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

  const fetchPosts = () => {
    setPostsLoading(true);
    const pageSize = 15;
    return get("post/timeline/" + params.userId, {
      pageSize,
      lastDate,
      lastPostId,
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setPostsLoading(false);
          setNoMorePosts(true);
        }
        const photos = res.data.map((data: any) => {
          if (data.media.length > 0) {
            const media = data.media[0];
            if (media?.type === "video") {
              data.src = `${env.VITE_API_URL}/media/${media?.thumbnail?.filename}`;
            } else {
              data.src = `${env.VITE_API_URL}/media/${media?.filename}`;
            }
          }
          return data;
        });
        setPosts((p) => [...p, ...photos]);
        setLastDate(res.lastDate);
        setLastPostId(res.lastPostId);
        setPostsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPostsLoading(false);
      });
  };

  if (pageLoading) {
    return (
      <>
        <div className="tw-flex tw-gap-5">
          <Skeleton className="!tw-block !tw-w-[150px] !tw-h-[150px] tw-rounded-[50%]" />
          <Skeleton className="!tw-h-[150px]" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Basic Info */}
      <div>
        <div className="tw-flex tw-w-full tw-flex-col sm:tw-flex-row">
          <div
            className="tw-pr-2 tw-bg-[var(--primary-color)] sm:tw-bg-transparent"
            style={{ borderRight: "4px solid var(--primary-color)" }}
          >
            <img
              src={profile.profile_img}
              alt=""
              className="tw-rounded-[50%]"
              style={{ widows: "150px", height: "150px" }}
            />
          </div>
          <div className="tw-flex tw-flex-col tw-w-full tw-px-2">
            <div className="tw-flex-grow tw-flex tw-flex-col md:tw-flex-row">
              <div className="tw-flex tw-flex-grow tw-flex-col">
                <div className={style.textContainer}>
                  <span className={style.label}>Full Name: </span>
                  <span>{getName(profile)}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Email: </span>
                  <span>{profile.email ?? "-"}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>WhatsApp: </span>
                  <span>{profile.whatsapp ?? "-"}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Joined On: </span>
                  <span>{getDate(profile.createdAt)}</span>
                </div>
              </div>
              <div className="tw-flex">
                <div className="tw-flex tw-flex-col tw-items-start md:tw-items-end">
                  <span className={style.label + " " + style.textContainer}>
                    Account Status:
                  </span>
                  <span className={style.label + " " + style.textContainer}>
                    Account Provider:
                  </span>
                  <span className={style.label + " " + style.textContainer}>
                    Account Completion:
                  </span>
                </div>
                <div className="tw-flex tw-flex-col tw-items-center">
                  <span className={style.textContainer}>
                    <Tag type={getStatusSeverity(profile.status)}>active</Tag>
                  </span>
                  <span className={style.textContainer}>
                    <ProfileProviders provider={profile.provider} />
                  </span>
                  <span className={style.textContainer}>
                    <AccountCompletion is_complete={profile.is_complete} />
                  </span>
                </div>
              </div>
            </div>
            <div className="tw-flex text-white">
              <div className={style.tab + " bg-primary"}>
                <span>{profile.posts_count}</span>
                <span>Posts</span>
              </div>
              <div className={style.tab + " bg-primary"}>
                <span>{profile.followers_count}</span>
                <span>Followers</span>
              </div>
              <div className={style.tab + " bg-primary"}>
                <span>{profile.following_count}</span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <span className={style.label}>Bio: </span>
          <span>{profile.bio}</span>
        </div>
      </div>

      {/* POSTS */}
      <div>
        <hr />
        <div className="tw-text-3xl tw-text-[#012970] tw-text-center">
          Posts
        </div>
        <hr />
        <section className="section tw-py-2">
          <div className="row">
            {posts.map((post: any, i: number) => (
              <div
                key={i}
                className="col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("post/" + post._id)}
              >
                <div className="card">
                  <div className="card-body tw-h-[200px] !tw-p-0">
                    <img
                      src={post.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {!noMorePosts && !postsLoading && (
          <div className="tw-flex tw-justify-center">
            <button
              onClick={fetchPosts}
              className="btn btn-primary tw-w-full tw-max-w-[500px]"
            >
              <i className="bi bi-arrow-clockwise tw-mr-2 tw-text-lg"></i>
              <span>Show More</span>
            </button>
          </div>
        )}
        {postsLoading && <BlinkingLoadingCircles />}
      </div>
    </>
  );
}
