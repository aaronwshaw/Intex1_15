//One shop stop to change api. Also will change based on local vs production

// src/api/config.ts
const local = 'https://localhost:5000';
const production =
  'https://intex1-15-backend-d9ehehbcgrajf7fk.eastus-01.azurewebsites.net';

export const API_url = production;
//production;
//import.meta.env.MODE === 'development' ? local : production;
