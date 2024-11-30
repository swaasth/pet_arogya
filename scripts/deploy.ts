import { execSync } from 'child_process'

async function deploy() {
  try {
    // Build the application
    console.log('Building application...')
    execSync('npm run build', { stdio: 'inherit' })

    // Run any pre-deployment database migrations
    console.log('Running database migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })

    console.log('Deployment preparation complete!')
  } catch (error) {
    console.error('Deployment preparation failed:', error)
    process.exit(1)
  }
}

deploy() 