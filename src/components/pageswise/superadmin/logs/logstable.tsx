import React, { useState } from 'react';
import { Copy, Check, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  module: string;
  status: string;
  message: string;
  ip: string;
}

interface LogsTableProps {
  logs: LogEntry[];
  loading?: boolean;
  error?: string | null;
}

const LogsTable: React.FC<LogsTableProps> = ({ 
  logs, 
  loading = false, 
  error 
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const getStatusBadge = (status: string) => {
    return status === 'Success' ? (
      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
        <Check className="h-3 w-3 mr-1" />
        Success
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
  };

  const getModuleBadge = (module: string) => {
    const moduleConfig = {
      'Authentication': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🔐' },
      'Campaigns': { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📢' },
      'Templates': { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: '📝' },
      'WhatsApp': { color: 'bg-green-100 text-green-700 border-green-200', icon: '💬' },
      'Billing': { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '💳' },
      'Automation': { color: 'bg-pink-100 text-pink-700 border-pink-200', icon: '⚡' },
      'Contacts': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '👥' }
    };

    const config = moduleConfig[module as keyof typeof moduleConfig] || 
                  { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '📋' };

    return (
      <Badge variant="secondary" className={`${config.color} text-xs`}>
        <span className="mr-1">{config.icon}</span>
        {module}
      </Badge>
    );
  };

  const copyToClipboard = async (log: LogEntry) => {
    const text = `${log.timestamp} - ${log.action}: ${log.message} (IP: ${log.ip})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(log.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (error) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Logs</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Eye className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Available</h3>
        <p className="text-gray-600">There are no logs to display at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Module</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Message</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const { date, time } = formatTimestamp(log.timestamp);
              return (
                <TableRow 
                  key={log.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell className="font-mono text-xs">
                    <div className="text-gray-900">{date}</div>
                    <div className="text-gray-500">{time}</div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {log.action}
                  </TableCell>
                  <TableCell>{getModuleBadge(log.module)}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-gray-600" title={log.message}>
                      {log.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      IP: {log.ip}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(log);
                        }}
                        className="h-8 w-8 p-0"
                        title="Copy log entry"
                      >
                        {copiedId === log.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="h-8 w-8 p-0"
                        title="View details"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Log Entry Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this log entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.ip}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Action</label>
                  <p className="text-sm text-gray-900">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Module</label>
                  <div className="mt-1">{getModuleBadge(selectedLog.module)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">
                  {selectedLog.message}
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(selectedLog)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Full Entry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogsTable;
