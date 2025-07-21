#!/usr/bin/env node

/**
 * Deployment Readiness Check Script
 * Verifies that the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Running Deployment Readiness Check...\n');

let hasErrors = false;
let hasWarnings = false;

function logError(message) {
  console.log(`❌ ERROR: ${message}`);
  hasErrors = true;
}

function logWarning(message) {
  console.log(`⚠️  WARNING: ${message}`);
  hasWarnings = true;
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

// Check 1: Verify critical files exist
console.log('📁 Checking critical files...');
const criticalFiles = [
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'vite.config.ts',
  'vercel.json',
  'public/favicon.ico',
  'public/assets/images/default-avatar.svg',
  'public/assets/images/default-logo.svg',
  'public/assets/templates/sample-template.svg'
];

criticalFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    logSuccess(`${file} exists`);
  } else {
    logError(`Missing critical file: ${file}`);
  }
});

// Check 2: Verify no hardcoded file:// URLs
console.log('\n🔍 Checking for hardcoded file:// URLs...');
function checkFileForHardcodedPaths(filePath, relativePath) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fileProtocolRegex = /file:\/\/[^\s"']+/g;
  const matches = content.match(fileProtocolRegex);
  
  if (matches) {
    logError(`Found hardcoded file:// URLs in ${relativePath}: ${matches.join(', ')}`);
  }
}

// Check common source files
const srcDir = path.join(rootDir, 'src');
function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      callback(filePath, path.relative(rootDir, filePath));
    }
  });
}

walkDirectory(srcDir, checkFileForHardcodedPaths);

// Check 3: Verify environment configuration
console.log('\n🌍 Checking environment configuration...');
const envFiles = ['.env.example', '.env.production'];
envFiles.forEach(envFile => {
  const envPath = path.join(rootDir, envFile);
  if (fs.existsSync(envPath)) {
    logSuccess(`${envFile} exists`);
  } else {
    logWarning(`Missing environment file: ${envFile}`);
  }
});

// Check 4: Verify Vite configuration
console.log('\n⚙️  Checking Vite configuration...');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  if (viteConfig.includes('base: \'/\'')) {
    logSuccess('Vite base path is correctly set');
  } else {
    logWarning('Vite base path should be set to "/" for deployment');
  }
  
  if (viteConfig.includes('publicDir: \'public\'')) {
    logSuccess('Vite public directory is correctly configured');
  } else {
    logWarning('Vite public directory should be explicitly set');
  }
}

// Check 5: Verify Vercel configuration
console.log('\n🔧 Checking Vercel configuration...');
const vercelConfigPath = path.join(rootDir, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  
  if (vercelConfig.framework === 'vite') {
    logSuccess('Vercel framework is set to Vite');
  } else {
    logError('Vercel framework should be set to "vite"');
  }
  
  if (vercelConfig.outputDirectory === 'dist') {
    logSuccess('Vercel output directory is correctly set');
  } else {
    logError('Vercel output directory should be "dist"');
  }
  
  if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
    logSuccess('Vercel SPA rewrites are configured');
  } else {
    logError('Vercel should have SPA rewrites configured');
  }
}

// Check 6: Verify package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    logSuccess('Build script exists');
  } else {
    logError('Missing build script in package.json');
  }
  
  if (packageJson.scripts && packageJson.scripts['type-check']) {
    logSuccess('Type check script exists');
  } else {
    logWarning('Missing type-check script in package.json');
  }
}

// Check 7: Verify asset structure
console.log('\n🖼️  Checking asset structure...');
const assetsDir = path.join(rootDir, 'public', 'assets');
const requiredAssetDirs = ['images', 'videos', 'gifs', 'templates'];

requiredAssetDirs.forEach(dir => {
  const dirPath = path.join(assetsDir, dir);
  if (fs.existsSync(dirPath)) {
    logSuccess(`Assets directory exists: ${dir}`);
  } else {
    logWarning(`Missing assets directory: ${dir}`);
  }
});

// Final summary
console.log('\n📊 Deployment Readiness Summary:');
console.log('================================');

if (hasErrors) {
  console.log('❌ DEPLOYMENT NOT READY - Please fix the errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  DEPLOYMENT READY WITH WARNINGS - Consider addressing the warnings above');
  process.exit(0);
} else {
  console.log('✅ DEPLOYMENT READY - All checks passed!');
  process.exit(0);
}
