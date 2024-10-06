import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// PayU configuration settings
export const payUConfig = {
    key: process.env.PAYU_KEY, // PayU Merchant Key
    salt_32: process.env.PAYU_SALT_32, // PayU 32-bit Salt
    salt_256: process.env.PAYU_SALT_256, // PayU 256-bit Salt
    clientId: process.env.PAYU_CLIENT_ID, // PayU Client ID
    clientSecret: process.env.PAYU_CLIENT_SECRET, // PayU Client Secret
    surl: 'https://your-success-url.com', // Success URL for payment
    furl: 'https://your-failure-url.com'  // Failure URL for payment
};
