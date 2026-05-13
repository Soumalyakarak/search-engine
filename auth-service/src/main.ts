import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 6001;

const server = app.listen(PORT, () => {
  console.log(`Auth service running at http://localhost:${PORT}`);
//   console.log(`API base: http://localhost:${PORT}/api`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
