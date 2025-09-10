#!/usr/bin/env node

/**
 * Setup script for Railway Backend
 * Creates necessary directories and helps with initial configuration
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up Railway Backend...\n');

// Create necessary directories
const directories = [
  'uploads',
  'uploads/profile-pictures',
  'logs'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✅ Created: ${dir}/`);
  } else {
    console.log(`   ✓ Exists: ${dir}/`);
  }
});

// Create .gitkeep files
const gitkeepFiles = [
  'uploads/.gitkeep',
  'uploads/profile-pictures/.gitkeep',
  'logs/.gitkeep'
];

console.log('\n📄 Creating .gitkeep files...');
gitkeepFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '# Keep this directory in git\n');
    console.log(`   ✅ Created: ${file}`);
  } else {
    console.log(`   ✓ Exists: ${file}`);
  }
});

// Check for .env file
console.log('\n🔧 Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Generate a secure JWT secret
    const jwtSecret = crypto.randomBytes(64).toString('hex');
    const envContent = envExample.replace(
      'your_super_secure_jwt_secret_key_here_minimum_32_characters',
      jwtSecret
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('   ✅ Created .env file with secure JWT secret');
    console.log('   ⚠️  Please update MongoDB URI and other settings in .env');
  } else {
    console.log('   ❌ .env.example not found');
  }
} else {
  console.log('   ✓ .env file exists');
  
  // Check if JWT_SECRET needs to be updated
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your_super_secure_jwt_secret_key_here_minimum_32_characters')) {
    console.log('   ⚠️  Please update your JWT_SECRET in .env file');
  }
}

// Check package.json and dependencies
console.log('\n📦 Checking package.json...');
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('   ✓ package.json exists');
  console.log('   💡 Run "npm install" to install dependencies');
} else {
  console.log('   ❌ package.json not found');
}

// Create a simple test script
console.log('\n🧪 Creating test script...');
const testScript = `
// Simple connection test
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }
    
    console.log('🔄 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connection successful!');
    
    console.log('🔄 Testing JWT secret...');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.log('❌ JWT_SECRET must be at least 32 characters long');
      process.exit(1);
    }
    console.log('✅ JWT secret is valid!');
    
    console.log('\\n🎉 All tests passed! Your backend is ready to run.');
    console.log('💡 Start with: npm run dev');
    
    mongoose.disconnect();
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
`;

const testPath = path.join(__dirname, 'test-connection.js');
fs.writeFileSync(testPath, testScript.trim());
console.log('   ✅ Created test-connection.js');

console.log('\n✨ Setup complete!\n');

console.log('📋 Next steps:');
console.log('   1. Update .env with your MongoDB URI');
console.log('   2. Run: npm install');
console.log('   3. Test connection: node test-connection.js');
console.log('   4. Start development: npm run dev');
console.log('   5. Visit: http://localhost:5000/api/health\n');

console.log('🔗 Useful commands:');
console.log('   npm run dev     - Start development server');
console.log('   npm start       - Start production server');
console.log('   node setup.js   - Run this setup again');
console.log('   node test-connection.js - Test database connection\n');

console.log('📚 API Documentation available in README.md');
console.log('🎯 Happy coding! 🚀');