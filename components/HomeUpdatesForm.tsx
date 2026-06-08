import { TallyButton } from "@/components/LeadForms";

export function HomeUpdatesForm() {
  return (
    <div className="home-v4-email-form">
      <label>Email Address</label>
      <div>
        <TallyButton form="reports">
          Subscribe To Blog Updates
        </TallyButton>
      </div>
    </div>
  );
}
