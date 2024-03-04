export default function Card({
  title,
  value,
  icon,
    card_class,
}: 
{
  title: string;
  value: string;
  icon: string;
    card_class: string;
}) {
  return (
    <div className="col-xxl-4 col-md-4 col-sm-6">
      <div className={"card info-card " + card_class}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>

          <div className="d-flex align-items-center">
            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
              <i className={icon}></i>
            </div>
            <div className="ps-3">
              <h6>{value}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
