import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Play, Trash2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { listFlows, deleteFlow, createFlow, exportFlowAsJSON, initializeMockData } from '@/service/api/flows';
import { Flow } from '@/data/dummyFlows';

const FlowList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);

  // Create flow dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newFlowDescription, setNewFlowDescription] = useState('');

  useEffect(() => {
    initializeMockData();
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const data = await listFlows();
      setFlows(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load flows',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Open dialog to ask for name
  const handleCreateFlow = () => {
    setNewFlowName('');
    setNewFlowDescription('');
    setIsCreateOpen(true);
  };

  // Confirm create with provided name, then navigate to builder
  const handleConfirmCreate = async () => {
    if (!newFlowName.trim()) return;
    try {
      setCreating(true);
      const newFlow = await createFlow({
        name: newFlowName.trim(),
        description: newFlowDescription.trim(),
        status: 'draft',
        triggers: [],
        nodes: [],
        edges: [],
      });
      setIsCreateOpen(false);
      toast({
        title: 'Success',
        description: `Flow "${newFlow.name}" created`,
      });
      navigate(`/admin/flows/${newFlow.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create flow',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFlow = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteFlow(id);
      toast({
        title: 'Success',
        description: 'Flow deleted successfully',
      });
      loadFlows();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete flow',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicateFlow = async (flow: Flow) => {
    try {
      const { id, createdAt, updatedAt, ...flowData } = flow;
      const newFlow = await createFlow({
        ...flowData,
        name: `${flow.name} (Copy)`,
      });
      toast({
        title: 'Success',
        description: 'Flow duplicated successfully',
      });
      loadFlows();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate flow',
        variant: 'destructive',
      });
    }
  };

  const handleExportFlow = (flow: Flow) => {
    exportFlowAsJSON(flow);
    toast({
      title: 'Success',
      description: 'Flow exported successfully',
    });
  };

  const getStatusColor = (status: Flow['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flows...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Flows</h1>
            <p className="text-gray-600 mt-1">Create and manage your WhatsApp automation flows</p>
          </div>
          <Button onClick={handleCreateFlow} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            New Flow
          </Button>
        </div>

        {/* Flows Grid */}
        {flows.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No flows yet</h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first automation flow
                </p>
                <Button onClick={handleCreateFlow} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Flow
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <Card
                key={flow.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/admin/flows/${flow.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {flow.description || 'No description'}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/flows/${flow.id}`);
                        }}>
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateFlow(flow);
                        }}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleExportFlow(flow);
                        }}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFlow(flow.id, flow.name);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flow.status)}`}>
                        {flow.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Nodes</span>
                      <span className="font-medium">{flow.nodes?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Connections</span>
                      <span className="font-medium">{flow.edges?.length || 0}</span>
                    </div>
                    {flow.triggers && flow.triggers.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600 mb-1">Triggers:</p>
                        <div className="flex flex-wrap gap-1">
                          {flow.triggers.slice(0, 3).map((trigger, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs">
                              {trigger}
                            </span>
                          ))}
                          {flow.triggers.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{flow.triggers.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Flow Card */}
            <Card
              className="border-2 border-dashed border-gray-300 hover:border-teal-500 hover:bg-teal-50/50 transition-colors cursor-pointer flex items-center justify-center min-h-[280px]"
              onClick={handleCreateFlow}
            >
              <CardContent className="text-center py-12">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-teal-600" />
                </div>
                <p className="text-gray-600 font-medium">Add New Flow</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Flow Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Name your new flow</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <Input
              autoFocus
              placeholder="Enter flow name"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFlowName.trim()) {
                  handleConfirmCreate();
                }
              }}
            />
            <Input
              placeholder="Enter short description (optional)"
              value={newFlowDescription}
              onChange={(e) => setNewFlowDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newFlowName.trim()) {
                  handleConfirmCreate();
                }
              }}
            />
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreate} disabled={!newFlowName.trim() || creating} className="bg-teal-600 hover:bg-teal-700">
              {creating ? 'Creating...' : 'Create Flow'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FlowList;
