import Header from './components/Header'
import KPICards from './components/KPICards'
import RevenueChart from './components/RevenueChart'
import ProductMix from './components/ProductMix'
import ProjectPipeline from './components/ProjectPipeline'
import RoadmapTimeline from './components/RoadmapTimeline'
import ActivityFeed from './components/ActivityFeed'

export default function App() {
  return (
    <div className="min-h-screen bg-[#07090c]">
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><RevenueChart /></div>
          <div className="lg:col-span-1"><ProductMix /></div>
        </div>

        <ProjectPipeline />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><RoadmapTimeline /></div>
          <div className="lg:col-span-1"><ActivityFeed /></div>
        </div>
      </main>
    </div>
  )
}
