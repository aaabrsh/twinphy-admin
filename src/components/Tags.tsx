export function Tag({ children, type }: { children: any; type?: string }) {
  const getBadge = (type: string) => {
    switch (type) {
      case "primary":
        return <span className="badge bg-primary">{children}</span>;
      case "secondary":
        return <span className="badge bg-secondary">{children}</span>;
      case "success":
        return <span className="badge bg-success">{children}</span>;
      case "danger":
        return <span className="badge bg-danger">{children}</span>;
      case "warning":
        return <span className="badge bg-warning text-dark">{children}</span>;
      case "info":
        return <span className="badge bg-info text-dark">{children}</span>;
      case "light":
        return <span className="badge bg-light text-dark">{children}</span>;
      case "dark":
        return <span className="badge bg-dark">{children}</span>;
      default:
        return <span className="badge bg-primary">{children}</span>;
    }
  };

  return <>{getBadge(type ?? "")}</>;
}

export function ProfileProviders({ provider }: { provider: any }) {
  const getBadge = (provider: string) => {
    switch (provider) {
      case "google":
        return (
          <span className="tw-bg-green-100 tw-text-[#0F9D58] tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
            {provider}
          </span>
        );
      case "facebook":
        return (
          <span className="tw-bg-blue-100 tw-text-[#4267B2] tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
            {provider}
          </span>
        );
      case "instagram":
        return (
          <span className="tw-bg-[#e1306b30] tw-text-[#E1306C] tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
            {provider}
          </span>
        );
      default:
        return (
          <span className="tw-bg-blue-100 tw-text-blue-800 tw-text-sm tw-font-medium tw-mr-2 tw-px-2.5 tw-py-1 tw-rounded">
            {provider}
          </span>
        );
    }
  };

  return <>{getBadge(provider)}</>;
}

export function AccountCompletion({ is_complete }: { is_complete: any }) {
  return <div
    className={`tw-flex tw-gap-1 tw-items-center ${
      is_complete.toString() === "true"
        ? "tw-text-green-500"
        : "tw-text-red-500"
    }`}
  >
    <i
      className={`bi ${
        is_complete.toString() === "true"
          ? "bi-bookmark-check-fill"
          : "bi-bookmark-x-fill"
      }  tw-text-2xl`}
    ></i>
    <span className="">{is_complete.toString()}</span>
  </div>;
}
