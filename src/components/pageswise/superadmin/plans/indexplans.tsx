import React, { useState } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import components
import HeaderCard from "./headercard";
import PlanCard from "./plancard";
import PlanDialog from "./plandialog";
import ErrorBoundary from "./errorboundary";

// Import data hook
import { usePlansData, Plan, PlanFormData } from "./plansdata";

const SuperAdminPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use the plans data hook
  const {
    plans,
    loading,
    error,
    saving,
    createPlan,
    updatePlan,
    togglePlanStatus,
    refetchPlans,
  } = usePlansData();

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleSavePlan = async (formData: PlanFormData) => {
    try {
      if (selectedPlan) {
        await updatePlan(selectedPlan.id, formData);
        toast({
          title: "Plan Updated",
          description: "Plan has been updated successfully.",
        });
      } else {
        await createPlan(formData);
        toast({
          title: "Plan Created",
          description: "New plan has been created successfully.",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  const handleTogglePlanStatus = async (planId: number) => {
    try {
      await togglePlanStatus(planId);
      const plan = plans.find((p) => p.id === planId);
      toast({
        title: "Plan Status Updated",
        description: `Plan has been ${
          plan?.isActive ? "deactivated" : "activated"
        } successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update plan status",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetchPlans();
    toast({
      title: "Data Refreshed",
      description: "Plans data has been refreshed successfully.",
    });
  };

  // Show global error state
  if (error && !loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Plans
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Plans
            </h1>
            <p className="text-gray-600 mt-1">
              Manage pricing plans and features for the platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleCreatePlan}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          </div>
        </div>

        {/* Stats */}
        <HeaderCard plans={plans} loading={loading} error={error} />

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <PlanCard
                key={index}
                plan={{} as Plan}
                onEdit={() => {}}
                onToggleStatus={() => {}}
                loading={true}
              />
            ))
          ) : (
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onToggleStatus={handleTogglePlanStatus}
                loading={saving}
              />
            ))
          )}
        </div>

        {/* Plan Dialog */}
        <PlanDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSavePlan}
          selectedPlan={selectedPlan}
          loading={saving}
        />
      </div>
    </ErrorBoundary>
  );
};

export default SuperAdminPlans;
