import Card from "../ui/Card";

export default function CardsContainer({ data }: { data: any }) {
  return (
    <>
      <div className="row">
        <Card
          title="Users"
          value={data?.usersCount ?? 0}
          icon="bi bi-people"
          card_class="customers-card"
        />
        <Card
          title="Competitions"
          value={data?.competitionsCount ?? 0}
          icon="bi bi-trophy"
          card_class="sales-card"
        />
        <Card
          title="Revenue"
          value={"$" + (data?.totalRevenue ?? 0)}
          icon="bi bi-currency-rupee"
          card_class="revenue-card"
        />
      </div>
    </>
  );
}
