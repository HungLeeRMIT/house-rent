import { useAuthStore } from '../store/authStore'
import TenantDashboard from './TenantDashboard'
import LandlordDashboard from './LandlordDashboard'
import PropertyManagerDashboard from './PropertyManagerDashboard'

function Dashboard() {
  const { user } = useAuthStore()

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'TENANT':
      return <TenantDashboard />
    case 'LANDLORD':
      return <LandlordDashboard />
    case 'PROPERTY_MANAGER':
      return <PropertyManagerDashboard />
    default:
      return <TenantDashboard />
  }
}

export default Dashboard


