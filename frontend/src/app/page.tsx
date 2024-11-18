import DashboardLayout from '@/components/layouts/DashboardLayout'
import DogList from '@/components/DogList'
import HealthMetrics from '@/components/HealthMetrics'

export default function Home() {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <HealthMetrics />
            <DogList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
