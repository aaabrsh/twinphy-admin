import {
  AccountCompletion,
  ProfileProviders,
  Tag,
} from "../../components/Tags";
import { getStatusSeverity } from "../../utils/account-status";
import style from "./profile.module.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

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
              src="https://xsgames.co/randomusers/avatar.php?g=male"
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
                  <span>John Doe</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Email: </span>
                  <span>test@gmail.com</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>WhatsApp: </span>
                  <span>+82779827732</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Joined On: </span>
                  <span>21/11/2023</span>
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
                    <Tag type={getStatusSeverity("active")}>active</Tag>
                  </span>
                  <span className={style.textContainer}>
                    <ProfileProviders provider={"instagram"} />
                  </span>
                  <span className={style.textContainer}>
                    <AccountCompletion is_complete={true} />
                  </span>
                </div>
              </div>
            </div>
            <div className="tw-flex bg-primary text-white">
              <div className={style.tab}>
                <span>10</span>
                <span>Posts</span>
              </div>
              <div className={style.tab}>
                <span>1.5K</span>
                <span>Followers</span>
              </div>
              <div className={style.tab}>
                <span>55</span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <span className={style.label}>Bio: </span>
          <span>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis harum
            qui nam reiciendis temporibus illo, eum dicta facere animi explicabo
            voluptatum fugiat. Atque est adipisci dolor ullam, facere nam
            dolore?
          </span>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val: any, i: number) => (
              <div
                key={i}
                className="col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("post/" + val)}
              >
                <div className="card">
                  <div className="card-body tw-h-[200px] !tw-p-0">
                    <img
                      src="https://xsgames.co/randomusers/avatar.php?g=male"
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "scale-down",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="tw-flex tw-justify-center">
          <button className="btn btn-primary tw-w-full tw-max-w-[500px]">
            <i className="bi bi-arrow-clockwise tw-mr-2 tw-text-lg"></i>
            <span>Show More</span>
          </button>
        </div>
      </div>
    </>
  );
}
