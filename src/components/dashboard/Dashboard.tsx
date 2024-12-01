'use client'

import { User } from '@prisma/client'
import WelcomeHeader from './WelcomeHeader'
import PetCardsGrid from './PetCardsGrid'
import VaccinationSchedule from './VaccinationSchedule'
import HealthAlerts from './HealthAlerts'
import QuickActions from './QuickActions'
import HealthMetrics from './HealthMetrics'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-6">
      <WelcomeHeader userName={user.full_name || user.email} />
      
      {/* Health Metrics */}
      <HealthMetrics />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Pet Cards Section */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Your Pets</h2>
            <PetCardsGrid />
          </div>
          
          {/* Vaccination Schedule */}
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Vaccination Schedule</h2>
            <VaccinationSchedule />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          <HealthAlerts />
          <QuickActions />
        </div>
      </div>
    </div>
  )
} 