import { Navigate, Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { Landing } from './routes/Landing'
import { Dashboard } from './routes/Dashboard'
import { CreatePlan } from './routes/CreatePlan'
import { Docs } from './routes/Docs'
import { PlanDetail } from './routes/PlanDetail'
import { Legal } from './routes/Legal'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="create" element={<CreatePlan />} />
        <Route path="plan/:planId" element={<PlanDetail />} />
        <Route path="docs" element={<Docs />} />
        <Route path="docs/:slug" element={<Docs />} />
        <Route path="legal" element={<Legal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
