import { useEffect } from 'react'
import { MainLayout } from '@components/layout/MainLayout'
import { Canvas2D } from '@components/canvas/Canvas2D'
//import { FlowWizard } from '@components/forms/FlowWizard'
//import { Sidebar } from '@components/navigation/Sidebar'
import { useFlowStore } from '@store/flowStore'

function App() {
  const flowStore = useFlowStore()

  return (
    <MainLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
    
        {/* Área Principal */}
        <main className="flex-1 flex flex-col">
          {/* Wizard para crear flujos */}
   
          
          {/* Canvas */}
          <div className="flex-1">
            <Canvas2D />
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

export default App