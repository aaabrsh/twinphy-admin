import { Link } from "react-router-dom";

export default function BreadCrumb({ data }: { data: any }) {
  return (
    <>
      <div className="pagetitle">
        <h1>{data.title}</h1>
        <nav>
          <ol className="breadcrumb">
            {data.path.map((path: any, i: number) => (
              <li
                key={i}
                className={`breadcrumb-item ${
                  i === data.path.length - 1 ? "active" : ""
                }`}
              >
                {path.isLink ? (
                  <Link to={path.to}>{path.text}</Link>
                ) : (
                  path.text
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </>
  );
}
