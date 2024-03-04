import Card from "../ui/Card";

export default function CardsContainer() {
  return (
    <>
      <div className="row">
        <Card
          title="Users"
          value="145"
          icon="bi bi-people"
          card_class="customers-card"
        />
        <Card
          title="Competitions"
          value="12"
          icon="bi bi-cart"
          card_class="sales-card"
        />
        <Card
          title="Revenue"
          value={"$" + "3264"}
          icon="bi bi-currency-dollar"
          card_class="revenue-card"
        />
      </div>
    </>
  );
}
