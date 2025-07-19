import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const ContactsImportExport: React.FC = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    imported?: number;
    errors?: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content
      const csvContent = [
        'Name,Phone,Email,Company,Tags,Status',
        'John Doe,+1234567890,john@example.com,Acme Corp,VIP,Active',
        'Jane Smith,+1234567891,jane@example.com,Tech Inc,Lead,Active',
        'Bob Johnson,+1234567892,bob@example.com,StartupXYZ,Customer,Inactive',
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Contacts have been exported to CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        setImportResult(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV or XLSX file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      // Simulate import process with progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Simulate import result
      const mockResult = {
        success: true,
        message: "Import completed successfully",
        imported: 156,
        errors: [
          "Row 23: Invalid phone number format",
          "Row 45: Missing email address"
        ]
      };
      
      setImportResult(mockResult);
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${mockResult.imported} contacts.`,
      });
    } catch (error) {
      setImportResult({
        success: false,
        message: "Import failed due to file format error",
      });
      
      toast({
        title: "Import Failed",
        description: "Failed to import contacts. Please check your file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      {/* Import Button */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV or XLSX file to import contacts to your list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Format Info */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Required format:</strong> CSV or XLSX with columns: Name, Phone, Email, Company (optional), Tags (optional)
              </AlertDescription>
            </Alert>
            
            {/* File Selection */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={isImporting}
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose File'}
              </Button>
            </div>
            
            {/* Import Progress */}
            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing contacts...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}
            
            {/* Import Result */}
            {importResult && (
              <Alert className={importResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {importResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className={importResult.success ? "text-green-800" : "text-red-800"}>
                      {importResult.message}
                    </p>
                    {importResult.imported && (
                      <p className="text-sm text-green-700">
                        {importResult.imported} contacts imported successfully
                      </p>
                    )}
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className="text-sm text-orange-700">
                        <p className="font-medium">Warnings:</p>
                        <ul className="list-disc list-inside">
                          {importResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetImport();
                  setIsImportDialogOpen(false);
                }}
                disabled={isImporting}
              >
                {importResult ? 'Close' : 'Cancel'}
              </Button>
              {!importResult && (
                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isImporting ? 'Importing...' : 'Import Contacts'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Button */}
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>
    </div>
  );
};

export default ContactsImportExport;
