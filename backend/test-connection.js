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
    
    console.log('\n🎉 All tests passed! Your backend is ready to run.');
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