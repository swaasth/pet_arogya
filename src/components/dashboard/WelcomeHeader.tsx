export default function WelcomeHeader({ userName }: { userName: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome Back, {userName}!
      </h1>
      <p className="text-gray-600">
        Here&apos;s what&apos;s happening with your pets today
      </p>
    </div>
  )
} 