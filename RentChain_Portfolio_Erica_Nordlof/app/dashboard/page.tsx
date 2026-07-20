import { DemoRentalManager } from "@/components/DemoRentalManager";

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Interactive portfolio demo</span>
          <h1>Rental operations console</h1>
          <p>Create a booking, generate its integrity proof and simulate or execute blockchain registration.</p>
        </div>
      </div>
      <DemoRentalManager />
    </div>
  );
}
