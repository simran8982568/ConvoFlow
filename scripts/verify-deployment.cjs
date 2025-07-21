#!/usr/bin/env node

/**
 * Simple Deployment Verification Script
 * Checks if the build is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const vercelConfigPath = path.join(rootDir, 'vercel.json');
const envProdPath = path.join(rootDir, '.env.production');

console.log('🚀 Verifying Deployment Readiness...\n');

let isReady = true;

// Check if dist directory exists
if (fs.existsSync(distDir)) {
  console.log('✅ Build directory exists');
  
  // Check if index.html exists in dist
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    console.log('✅ index.html exists in build directory');
  } else {
    console.log('❌ index.html missing from build directory');
    isReady = false;
  }
  
  // Check if assets directory exists in dist
  if (fs.existsSync(path.join(distDir, 'assets'))) {
    console.log('✅ assets directory exists in build');
  } else {
    console.log('❌ assets directory missing from build');
    isReady = false;
  }
} else {
  console.log('❌ Build directory missing. Run npm run build first.');
  isReady = false;
}

// Check if vercel.json exists
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json exists');
  
  // Read and validate vercel.json
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    if (vercelConfig.framework === 'vite') {
      console.log('✅ vercel.json has correct framework setting');
    } else {
      console.log('⚠️ vercel.json framework should be set to "vite"');
    }
    
    if (vercelConfig.outputDirectory === 'dist') {
      console.log('✅ vercel.json has correct output directory');
    } else {
      console.log('⚠️ vercel.json outputDirectory should be "dist"');
    }
    
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      console.log('✅ vercel.json has SPA rewrites configured');
    } else {
      console.log('⚠️ vercel.json should have SPA rewrites for client-side routing');
    }
  } catch (error) {
    console.log('❌ Error parsing vercel.json:', error.message);
    isReady = false;
  }
} else {
  console.log('❌ vercel.json missing');
  isReady = false;
}

// Check if .env.production exists
if (fs.existsSync(envProdPath)) {
  console.log('✅ .env.production exists');
} else {
  console.log('⚠️ .env.production is missing');
}

// Final verdict
console.log('\n📋 Deployment Readiness Summary:');
if (isReady) {
  console.log('✅ Your application is READY for Vercel deployment!');
  console.log('\nTo deploy, run:');
  console.log('  vercel --prod');
  console.log('\nOr use the Vercel dashboard to deploy from your GitHub repository.');
} else {
  console.log('❌ Your application is NOT READY for deployment.');
  console.log('Please fix the issues above before deploying.');
}

process.exit(isReady ? 0 : 1);
