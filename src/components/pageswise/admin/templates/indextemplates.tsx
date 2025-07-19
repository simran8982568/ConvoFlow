import React, { useState } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import components
import TemplateStatsCards from './templatestatscards';
import TemplateFilters from './templatefilters';
import TemplateGrid from './templategrid';

// Import data hook
import { useTemplatesData, Template } from './templatesdata';

const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { toast } = useToast();

  // Use the templates data hook
  const {
    data,
    loading,
    error,
    refreshing,
    filters,
    filteredTemplates,
    updateFilters,
    clearFilters,
    refreshData,
    refetchData
  } = useTemplatesData();

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Templates Refreshed",
      description: "Template data has been refreshed successfully.",
    });
  };

  const handleRetry = () => {
    refetchData();
    toast({
      title: "Retrying",
      description: "Attempting to reload template data...",
    });
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    // TODO: Open preview dialog
    toast({
      title: "Template Preview",
      description: `Previewing template: ${template.name}`,
    });
  };

  const handleEditTemplate = (template: Template) => {
    // TODO: Open edit dialog
    toast({
      title: "Edit Template",
      description: `Editing template: ${template.name}`,
    });
  };

  const handleDeleteTemplate = (template: Template) => {
    // TODO: Implement delete functionality
    toast({
      title: "Delete Template",
      description: `Template "${template.name}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleCreateTemplate = () => {
    // TODO: Open create dialog
    toast({
      title: "Create Template",
      description: "Opening template creation dialog...",
    });
  };

  // Show global error state
  if (error && !loading && !refreshing) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Failed to Load Templates
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-1">Manage your WhatsApp message templates</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={handleCreateTemplate}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <TemplateStatsCards 
        stats={data.stats} 
        loading={loading} 
        error={error} 
      />

      {/* Filters */}
      <TemplateFilters
        searchTerm={filters.searchTerm}
        filterCategory={filters.filterCategory}
        filterType={filters.filterType}
        onSearchChange={(value) => updateFilters({ searchTerm: value })}
        onCategoryChange={(value) => updateFilters({ filterCategory: value })}
        onTypeChange={(value) => updateFilters({ filterType: value })}
        onClearFilters={clearFilters}
        loading={loading}
        filteredCount={filteredTemplates.length}
        totalCount={data.templates.length}
      />

      {/* Templates Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        loading={loading}
        error={error}
        onPreview={handlePreviewTemplate}
        onEdit={handleEditTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};

export default AdminTemplates;
