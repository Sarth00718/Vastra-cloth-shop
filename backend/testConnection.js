import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

const testConnection = async () => {
    try {
        console.log('\n⏳ Attempting to connect...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'vastra_ecommerce',
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            family: 4,
        });
        
        console.log('\n✅ SUCCESS! MongoDB Connected');
        console.log('📍 Host:', conn.connection.host);
        console.log('📦 Database:', conn.connection.name);
        console.log('🔌 Ready State:', conn.connection.readyState);
        
        await mongoose.connection.close();
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ CONNECTION FAILED');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        
        console.error('\n🔧 Troubleshooting Steps:');
        console.error('1. Go to https://cloud.mongodb.com/');
        console.error('2. Check if your cluster is ACTIVE (not paused)');
        console.error('3. Go to Network Access → Add your current IP address');
        console.error('4. Or allow access from anywhere (0.0.0.0/0) for testing');
        console.error('5. Verify your username and password are correct');
        
        process.exit(1);
    }
};

testConnection();
