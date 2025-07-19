import { mockBillingData, availablePlans } from "./mockdata";
import CurrentPlan from "./currentplan";
import AvailablePlans from "./availableplans";
import PaymentMethod from "./paymentmethod";
import Invoices from "./invoices";

const AdminBilling: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and payment details
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CurrentPlan />
        <PaymentMethod />
        <Invoices />
      </div>
      <AvailablePlans />
    </div>
  );
};

export default AdminBilling;
