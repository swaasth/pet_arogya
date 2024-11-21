export default function WelcomeHeader({ userName }: { userName: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome Back, {userName}!
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Your pet family's health is in good hands. Here's an overview.
      </p>
    </div>
  )
} 