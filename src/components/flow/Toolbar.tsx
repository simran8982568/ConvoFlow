import React from "react";
import {
  Save,
  CheckCircle,
  Play,
  Upload,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onBack?: () => void;
  onSave: () => void;
  onValidate: () => void;
  onSimulate: () => void;
  onImport: () => void;
  onExport: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  flowName,
  onFlowNameChange,
  onBack,
  onSave,
  onValidate,
  onSimulate,
  onImport,
  onExport,
  onClear,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving = false,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left: Back button and Flow Name */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 px-2"
          >
            ← Back
          </Button>
        )}
        <Input
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          placeholder="Flow Name"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-9"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={onZoomOut}
          className="h-9"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onZoomIn}
          className="h-9"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={onValidate}
          className="h-9"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Validate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSimulate}
          className="h-9 bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
        >
          <Play className="h-4 w-4 mr-2" />
          Simulate
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button variant="outline" size="sm" onClick={onImport} className="h-9">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="h-9 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          onClick={onSave}
          disabled={isSaving}
          className="h-9 bg-teal-600 hover:bg-teal-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Flow"}
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
