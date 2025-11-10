'use client';

import DashboardClient from '@/components/dashboard/dashboard-client';

export default function DashboardPage() {
  // Se ha eliminado la lógica de autenticación. El dashboard ahora es público.
  return <DashboardClient user={null} />;
}
