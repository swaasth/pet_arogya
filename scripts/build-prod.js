const { execSync } = require('child_process');

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Generating Prisma Client...');
execSync('npx prisma generate', { stdio: 'inherit' });

console.log('Building Next.js application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 