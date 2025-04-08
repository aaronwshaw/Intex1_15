//One shop stop to change api. Also will change based on local vs production

// src/api/config.ts
const local = 'https://localhost:5000';
const production = 'https://your-production-url.com';

export const API_url =
  import.meta.env.MODE === 'development' ? local : production;
