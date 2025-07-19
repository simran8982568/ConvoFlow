#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of critical files that must exist for the build to succeed
const criticalFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/layouts/AdminLayout.tsx',
  'src/layouts/SuperAdminLayout.tsx',
  'src/components/common/ResponsiveSidebar.tsx',
  'src/components/pageswise/admin/dashboard/indexdashboard.tsx',
  'src/components/pageswise/admin/templates/indextemplates.tsx',
  'src/components/pageswise/admin/contacts/indexcontacts.tsx',
  'src/components/pageswise/admin/campaigns/indexcampaigns.tsx',
  'src/components/pageswise/admin/inbox/indexinbox.tsx',
  'src/components/pageswise/admin/automation/indexautomation.tsx',
  'src/components/pageswise/admin/phonenumbers/indexphone.tsx',
  'src/components/pageswise/admin/settings/indexsettings.tsx',
  'src/components/pageswise/admin/billing/indexbilling.tsx',
  'src/components/pageswise/admin/analytics/indexanalytics.tsx',
  'src/components/pageswise/superadmin/dashboard/indexdashboard.tsx',
  'src/components/pageswise/superadmin/businesses/indexbusinesses.tsx',
  'src/components/pageswise/superadmin/templates/indextemplates.tsx',
  'src/components/pageswise/superadmin/analytics/indexanalytics.tsx',
  'src/components/pageswise/superadmin/plans/indexplans.tsx',
  'src/components/pageswise/superadmin/logs/indexlogs.tsx',
  'src/components/pageswise/superadmin/settings/indexsettings.tsx',
];

console.log('🔍 Verifying critical files exist...');

let allFilesExist = true;
const missingFiles = [];

for (const file of criticalFiles) {
  const fullPath = path.join(path.dirname(__dirname), file);
  if (!fs.existsSync(fullPath)) {
    allFilesExist = false;
    missingFiles.push(file);
    console.error(`❌ Missing: ${file}`);
  } else {
    console.log(`✅ Found: ${file}`);
  }
}

if (allFilesExist) {
  console.log('\n🎉 All critical files exist! Build can proceed.');
  process.exit(0);
} else {
  console.error(`\n💥 Build cannot proceed. Missing ${missingFiles.length} critical files:`);
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}
