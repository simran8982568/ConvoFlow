import React, { useState } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Import components
import TemplateStatsCards from './templatestatscards';
import TemplateFilters from './templatefilters';
import TemplateGrid from './templategrid';
import CreateTemplateModal from './CreateTemplateModal';
import WhatsAppPreviewModal from './WhatsAppPreviewModal';
import EditTemplateModal from './EditTemplateModal';

// Import data hook
import { useTemplatesData, Template } from './templatesdata';

const AdminTemplates: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
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
    refetchData,
    addTemplate,
    deleteTemplate
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
    setIsPreviewModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleDeleteTemplate = (template: Template) => {
    setTemplateToDelete(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      toast({
        title: "Template Deleted",
        description: `Template "${templateToDelete.name}" has been deleted.`,
        variant: "destructive",
      });
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateTemplate = () => {
    setIsCreateModalOpen(true);
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

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new WhatsApp message template with text, images, videos, and GIFs.
            </DialogDescription>
          </DialogHeader>
          <CreateTemplateModal
            onClose={() => setIsCreateModalOpen(false)}
            onTemplateCreated={addTemplate}
          />
        </DialogContent>
      </Dialog>

      {/* WhatsApp Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              WhatsApp-style preview of your template
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <WhatsAppPreviewModal
              template={selectedTemplate}
              onClose={() => setIsPreviewModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your template content and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <EditTemplateModal
              template={selectedTemplate}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
              All campaigns using this template will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTemplate}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTemplates;
