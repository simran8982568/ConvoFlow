import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { transactionData } from './dummydata';

const TransactionDetails = ({ filteredTransactionData, searchTerm = '' }) => {
  const [transactions, setTransactions] = useState(
    filteredTransactionData.length > 0 ? filteredTransactionData : transactionData
  );

  // Update transactions when filtered data changes
  React.useEffect(() => {
    if (filteredTransactionData.length > 0) {
      setTransactions(filteredTransactionData);
    } else {
      setTransactions(transactionData);
    }
  }, [filteredTransactionData]);

  // Filter transactions based on search term
  const filteredBySearch = transactions.filter((transaction) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.businessName.toLowerCase().includes(searchLower) ||
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.email.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    );
  });

  // Handle status toggle with backend sync simulation
  const handleStatusToggle = async (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const newStatus = transaction.status === 'Complete' ? 'Incomplete' : 'Complete';

    // Optimistic update - update UI immediately
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId
          ? { ...t, status: newStatus, isUpdating: true }
          : t
      )
    );

    try {
      // Simulate backend API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate potential API failure (uncomment to test error handling)
      // if (Math.random() < 0.1) throw new Error('Network error');

      // Update successful - remove loading state
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === transactionId
            ? { ...t, isUpdating: false }
            : t
        )
      );

      // Show success feedback
      console.log(`Transaction ${transactionId} status updated to ${newStatus}`);

    } catch (error) {
      // Revert optimistic update on error
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === transactionId
            ? { ...t, status: transaction.status, isUpdating: false }
            : t
        )
      );

      console.error('Failed to update transaction status:', error);
      // In a real app, you'd show a toast notification here
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'incomplete':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Render interactive status toggle button with loading state
  const renderStatusToggle = (transaction) => {
    const isComplete = transaction.status === 'Complete';
    const isUpdating = transaction.isUpdating;

    return (
      <Button
        onClick={() => handleStatusToggle(transaction.id)}
        size="sm"
        variant="outline"
        disabled={isUpdating}
        className={`
          transition-all duration-200 ease-in-out relative
          ${isComplete
            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
          }
          ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {isUpdating ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
            Updating...
          </>
        ) : isComplete ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Complete
          </>
        ) : (
          <>
            <X className="h-3 w-3 mr-1" />
            Incomplete
          </>
        )}
      </Button>
    );
  };

  const getPaymentTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'subscription':
        return 'bg-blue-100 text-blue-800';
      case 'campaign boost':
        return 'bg-purple-100 text-purple-800';
      case 'add-on':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Business</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBySearch.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-gray-900">{transaction.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.businessName}</p>
                          <p className="text-sm text-gray-500">{transaction.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{new Date(transaction.paymentDate).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPaymentTypeColor(transaction.paymentType)}>
                          {transaction.paymentType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {renderStatusToggle(transaction)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredBySearch.map((transaction) => (
              <Card key={transaction.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.businessName}</p>
                      <p className="text-sm text-gray-500">{transaction.email}</p>
                    </div>
                    {renderStatusToggle(transaction)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Transaction ID</p>
                      <p className="font-mono text-gray-900">{transaction.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="text-gray-900">{new Date(transaction.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <Badge className={getPaymentTypeColor(transaction.paymentType)}>
                        {transaction.paymentType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;