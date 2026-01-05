import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module. 
// This is robust and works regardless of the CWD.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the .env file in the project root. 
// After compilation, this file will be in `dist/server/_core/env.js`,
// so we need to go up three levels to reach the project root.
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });


/**
 * Environment configuration object
 * All values are read from process.env
 */
export const ENV = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Authentication & JWT
  jwtSecret: process.env.JWT_SECRET,
  oauthClientId: process.env.OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.OAUTH_CLIENT_SECRET,
  oauthRedirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/oauth/callback',

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Storage configuration
  storageType: (process.env.STORAGE_TYPE || 'local' ) as 'local' | 's3',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsBucket: process.env.AWS_BUCKET || 'xplore-viagens',

  // Email configuration (SMTP)
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM || 'noreply@xploreviagens.com',
  ownerEmail: process.env.OWNER_EMAIL,

  // API configuration
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL,
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY,
  manusApiBase: process.env.MANUS_API_BASE,
  appId: process.env.APP_ID,
};

/**
 * Validate required environment variables on startup
 * Throws error if any required variable is missing
 */
export function validateEnv( ): void {
  // Now that dotenv is loaded correctly, check for the variable.
  if (!process.env.DATABASE_URL) {
    console.error('\n❌ ERROR: Missing required environment variable: DATABASE_URL');
    console.error('\n📝 Please ensure DATABASE_URL is set in the .env file in the project root.');
    // Added for debugging the path issue:
    console.error(`   - CWD during execution: ${process.cwd()}`)
    console.error(`   - Attempted .env path: ${envPath}`)
    console.error('\n');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
}

/**
 * Log environment configuration (safe, no secrets)
 */
export function logEnvConfig(): void {
  console.log('');
  console.log('📋 Environment Configuration:');
  console.log(`   NODE_ENV: ${ENV.nodeEnv}`);
  console.log(`   PORT: ${ENV.port}`);
  console.log(`   DATABASE: ${ENV.databaseUrl?.split('@')[1] || 'unknown'}`);
  console.log(`   STORAGE: ${ENV.storageType}`);
  console.log(`   FRONTEND: ${ENV.frontendUrl}`);
  console.log('');
}
