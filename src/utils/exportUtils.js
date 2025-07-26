// Export utilities for CSV and PDF generation

// CSV Export using Papa Parse (fallback to manual CSV generation)
export const exportToCSV = (data, filename = 'export.csv') => {
  try {
    // Check if Papa Parse is available
    if (typeof Papa !== 'undefined' && Papa.unparse) {
      const csv = Papa.unparse(data);
      downloadFile(csv, filename, 'text/csv');
    } else {
      // Fallback to manual CSV generation
      const csvContent = generateCSVManually(data);
      downloadFile(csvContent, filename, 'text/csv');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    // Fallback to manual CSV generation
    const csvContent = generateCSVManually(data);
    downloadFile(csvContent, filename, 'text/csv');
  }
};

// Manual CSV generation fallback
const generateCSVManually = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

// PDF Export using jsPDF and html2canvas
export const exportToPDF = async (elementId, filename = 'export.pdf', options = {}) => {
  try {
    // Dynamic import for better code splitting
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Default options
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      ...options
    };

    const canvas = await html2canvas(element, defaultOptions);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgWidth = 280;
    const pageHeight = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 10;
    
    // Add title and timestamp
    pdf.setFontSize(16);
    pdf.text('Revenue Report', 10, position);
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, position + 10);
    
    position += 20;
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

// Revenue-specific export functions
export const exportRevenueDataToCSV = (transactions, filters = {}) => {
  const processedData = transactions.map(transaction => ({
    'Transaction ID': transaction.id,
    'Business Name': transaction.businessName,
    'Email': transaction.email,
    'Payment Date': transaction.paymentDate,
    'Amount': transaction.amount,
    'Payment Type': transaction.paymentType,
    'Status': transaction.status
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `revenue-data-${timestamp}.csv`;
  
  exportToCSV(processedData, filename);
};

export const exportRevenueToPDF = async (filters = {}) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `revenue-report-${timestamp}.pdf`;
    
    // Create a temporary container with all revenue data
    const tempContainer = document.createElement('div');
    tempContainer.id = 'revenue-export-container';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '1200px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20px';
    
    // Clone the revenue content
    const revenueContent = document.querySelector('.p-6.space-y-6');
    if (revenueContent) {
      tempContainer.innerHTML = revenueContent.innerHTML;
    }
    
    document.body.appendChild(tempContainer);
    
    await exportToPDF('revenue-export-container', filename);
    
    // Clean up
    document.body.removeChild(tempContainer);
  } catch (error) {
    console.error('Error exporting revenue PDF:', error);
    throw error;
  }
};

// Utility function to download files
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Filter data based on criteria
export const filterRevenueData = (data, filters) => {
  return data.filter(item => {
    // Date range filter
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      const itemDate = new Date(item.paymentDate);
      if (filters.dateRange.from && itemDate < new Date(filters.dateRange.from)) {
        return false;
      }
      if (filters.dateRange.to && itemDate > new Date(filters.dateRange.to)) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      const categoryMap = {
        'subscription': 'Subscription',
        'one-time': 'One-Time',
        'campaign-boost': 'Campaign Boost',
        'add-on': 'Add-on'
      };
      
      if (item.paymentType !== categoryMap[filters.category]) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableFields = [
        item.businessName,
        item.email,
        item.id,
        item.amount.toString()
      ];
      
      if (!searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      )) {
        return false;
      }
    }
    
    return true;
  });
};
