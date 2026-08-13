import { ReactFlowProvider } from '@xyflow/react'
import { MainLayout } from '@components/layout/MainLayout'
import { Sidebar } from '@components/navigation/Sidebar'
import { FlowWizard } from '@components/forms/FlowWizard'
import { FlowCanvas } from '@components/canvas/FlowCanvas'

function App() {
  return (
    <MainLayout>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <FlowWizard />
          <div className="flex-1 relative">
            <ReactFlowProvider>
              <FlowCanvas />
            </ReactFlowProvider>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}

export default App
