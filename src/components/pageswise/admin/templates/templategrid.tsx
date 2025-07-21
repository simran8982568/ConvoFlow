import React from 'react';
import { Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  category: string;
  type: 'system' | 'custom';
  status: 'approved' | 'pending' | 'rejected';
  content: {
    header: string;
    body: string;
    footer: string;
    buttons: string[];
  };
  createdAt: string;
  usageCount?: number;
}

interface TemplateGridProps {
  templates: Template[];
  loading?: boolean;
  error?: string | null;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
}

const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  loading = false,
  error,
  onPreview,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Marketing': 'bg-blue-100 text-blue-800',
      'Transactional': 'bg-green-100 text-green-800',
      'Utility': 'bg-purple-100 text-purple-800',
      'Authentication': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p className="font-medium">Error loading templates</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-24 sm:w-32 mb-2" />
              <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-16 sm:w-24" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="space-y-2">
                <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-2 sm:h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-full mt-3 sm:mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-gray-400 mb-4">
          <Eye className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
        <p className="text-gray-600">Create your first template to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm sm:text-base md:text-lg truncate">{template.name}</CardTitle>
                <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </Badge>
                  {template.type === 'system' && (
                    <Badge variant="outline" className="text-xs">System</Badge>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                {getStatusBadge(template.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              <div className="text-xs sm:text-sm text-gray-600">
                <p className="line-clamp-2">{template.content.body}</p>
              </div>

              {template.usageCount !== undefined && (
                <div className="text-xs text-gray-500">
                  Used {template.usageCount.toLocaleString()} times
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(template)}
                  className="flex-1 text-xs sm:text-sm h-7 sm:h-8"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Preview</span>
                  <span className="sm:hidden">View</span>
                </Button>
                {template.type === 'custom' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(template)}
                      className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(template)}
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateGrid;
