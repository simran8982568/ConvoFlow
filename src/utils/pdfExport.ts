// PDF Export Utility
// This is a simplified PDF generation utility
// In a production environment, you would use libraries like jsPDF, Puppeteer, or html2pdf

export interface DashboardData {
  stats: {
    totalMessages: string;
    activeContacts: string;
    campaignsSent: string;
    activeAutomations: string;
    messagesTrend: { value: string; isPositive: boolean };
    contactsTrend: { value: string; isPositive: boolean };
    campaignsTrend: { value: string; isPositive: boolean };
    automationsTrend: { value: string; isPositive: boolean };
  };
  recentActivities: Array<{
    id: number;
    campaign: string;
    status: 'Active' | 'Completed' | 'Scheduled';
    sent: number;
    delivered: number;
    time: string;
  }>;
  engagementData: Array<{
    name: string;
    messages: number;
    delivered: number;
    replies: number;
  }>;
}

export const generateDashboardPDF = async (data: DashboardData): Promise<Blob> => {
  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Dashboard Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0d9488;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          background: #f9fafb;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #0d9488;
          margin-bottom: 5px;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .activity-item {
          padding: 12px;
          border-left: 3px solid #0d9488;
          margin-bottom: 10px;
          background: #f0fdfa;
        }
        .activity-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .activity-desc {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .activity-time {
          color: #999;
          font-size: 12px;
        }
        .engagement-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .engagement-table th,
        .engagement-table td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        .engagement-table th {
          background: #f9fafb;
          font-weight: bold;
          color: #374151;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>AyuChat Dashboard Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="section">
        <h2>Key Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${data.stats?.totalMessages || '0'}</div>
            <div class="stat-label">Total Messages</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.stats?.activeContacts || '0'}</div>
            <div class="stat-label">Active Contacts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.stats?.campaignsSent || '0'}</div>
            <div class="stat-label">Campaigns Sent</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.stats?.activeAutomations || '0'}</div>
            <div class="stat-label">Active Automations</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Recent Activities</h2>
        ${data.recentActivities?.map(activity => `
          <div class="activity-item">
            <div class="activity-title">${activity.campaign}</div>
            <div class="activity-desc">Status: ${activity.status} | Sent: ${activity.sent} | Delivered: ${activity.delivered}</div>
            <div class="activity-time">${activity.time}</div>
          </div>
        `).join('') || '<p>No recent activities available.</p>'}
      </div>

      <div class="section">
        <h2>Engagement Data</h2>
        <table class="engagement-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Messages</th>
              <th>Delivered</th>
              <th>Replies</th>
              <th>Reply Rate</th>
            </tr>
          </thead>
          <tbody>
            ${data.engagementData?.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.messages?.toLocaleString() || 0}</td>
                <td>${item.delivered?.toLocaleString() || 0}</td>
                <td>${item.replies?.toLocaleString() || 0}</td>
                <td>${item.messages > 0 ? ((item.replies / item.messages) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join('') || '<tr><td colspan="5">No engagement data available.</td></tr>'}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>This report was generated by AyuChat Dashboard Export Feature</p>
        <p>For support, contact: support@ayuchat.com</p>
      </div>
    </body>
    </html>
  `;

  // Convert HTML to PDF (simplified approach)
  // In production, you would use a proper PDF library
  return new Blob([htmlContent], { type: 'text/html' });
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Alternative: Generate a simple text-based report
export const generateTextReport = (data: DashboardData): string => {
  const report = `
AYUCHAT DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}
${'='.repeat(50)}

KEY STATISTICS:
- Total Messages: ${data.stats?.totalMessages || '0'}
- Active Contacts: ${data.stats?.activeContacts || '0'}
- Campaigns Sent: ${data.stats?.campaignsSent || '0'}
- Active Automations: ${data.stats?.activeAutomations || '0'}

RECENT ACTIVITIES:
${data.recentActivities?.map((activity, index) =>
  `${index + 1}. ${activity.campaign}
   Status: ${activity.status} | Sent: ${activity.sent} | Delivered: ${activity.delivered}
   Time: ${activity.time}
`).join('\n') || 'No recent activities available.'}

ENGAGEMENT DATA:
${data.engagementData?.map(item =>
  `${item.name}: ${item.messages} messages, ${item.delivered} delivered, ${item.replies} replies`
).join('\n') || 'No engagement data available.'}

${'='.repeat(50)}
Report generated by AyuChat Dashboard
For support: support@ayuchat.com
  `;
  
  return report.trim();
};

export const downloadTextReport = (data: DashboardData, filename: string) => {
  const report = generateTextReport(data);
  const blob = new Blob([report], { type: 'text/plain' });
  downloadPDF(blob, filename);
};
