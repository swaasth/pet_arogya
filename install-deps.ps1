# Create fresh package.json
$packageJson = @{
    name = "pet_arogya"
    version = "0.1.0"
    private = $true
    scripts = @{
        dev = "next dev"
        build = "prisma generate && next build"
        start = "next start"
        lint = "next lint"
        postinstall = "prisma generate"
    }
}

# Convert to JSON and save
$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8

# Install dependencies in groups
$commands = @(
    "npm install next@latest react@latest react-dom@latest",
    "npm install @prisma/client@latest prisma@latest",
    "npm install @next-auth/prisma-adapter next-auth@latest",
    "npm install @headlessui/react@latest @heroicons/react@latest",
    "npm install @hookform/resolvers@latest react-hook-form@latest zod@latest",
    "npm install @radix-ui/react-dropdown-menu@latest @radix-ui/react-form@latest @radix-ui/react-hover-card@latest @radix-ui/react-slot@latest @radix-ui/react-tabs@latest",
    "npm install @tanstack/react-query@latest @tanstack/react-query-devtools@latest",
    "npm install class-variance-authority@latest clsx@latest tailwind-merge@latest",
    "npm install date-fns@latest react-day-picker@latest",
    "npm install framer-motion@latest lucide-react@latest",
    "npm install react-hot-toast@latest react-icons@latest sonner@latest",
    "npm install -D typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest",
    "npm install -D tailwindcss@latest postcss@latest autoprefixer@latest",
    "npm install -D eslint@latest eslint-config-next@latest"
)

foreach ($command in $commands) {
    Write-Host "Running: $command"
    Invoke-Expression $command
} 