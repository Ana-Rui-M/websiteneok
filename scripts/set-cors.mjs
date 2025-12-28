import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';

// Configuration
const BUCKET_NAMES = ['biblioangola.appspot.com', 'biblioangola.firebasestorage.app'];
const CORS_CONFIG_PATH = './scripts/cors.json';
const ENV_PATH = './.env.local';

async function setCors() {
  try {
    let storageOptions = {};
    
    // Try to load from .env.local manually
    if (fs.existsSync(ENV_PATH)) {
        console.log(`Loading credentials from ${ENV_PATH}...`);
        const envContent = fs.readFileSync(ENV_PATH, 'utf8');
        
        const projectIdMatch = envContent.match(/FIREBASE_PROJECT_ID=["']?([^"'\n]+)["']?/);
        const clientEmailMatch = envContent.match(/FIREBASE_CLIENT_EMAIL=["']?([^"'\n]+)["']?/);
        const privateKeyMatch = envContent.match(/FIREBASE_PRIVATE_KEY="([^"]+)"/);

        if (projectIdMatch && clientEmailMatch && privateKeyMatch) {
            console.log('Using individual FIREBASE_* variables from .env.local');
            storageOptions.projectId = projectIdMatch[1];
            // The private key in .env.local usually has literal \n that need to be real newlines
            storageOptions.credentials = {
                client_email: clientEmailMatch[1],
                private_key: privateKeyMatch[1].replace(/\\n/g, '\n'),
            };
        }
    }

    if (!storageOptions.credentials) {
        console.warn('No credentials found in .env.local. Falling back to default credentials.');
    }

    const storage = new Storage(storageOptions);
    const corsConfiguration = JSON.parse(fs.readFileSync(CORS_CONFIG_PATH, 'utf8'));

    for (const bucketName of BUCKET_NAMES) {
        try {
            console.log(`\nAttempting to set CORS for bucket: ${bucketName}...`);
            const bucket = storage.bucket(bucketName);
            
            // Check if bucket exists first to give better error
            const [exists] = await bucket.exists();
            if (!exists) {
                console.log(`ℹ️ Bucket ${bucketName} does not exist, skipping.`);
                continue;
            }

            await bucket.setCorsConfiguration(corsConfiguration);
            console.log(`✅ CORS configuration set successfully for ${bucketName}!`);
        } catch (err) {
            console.error(`❌ Failed to set CORS for ${bucketName}:`, err.message);
        }
    }

  } catch (error) {
    console.error('❌ Critical Error:', error);
    process.exit(1);
  }
}

setCors();
