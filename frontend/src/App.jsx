import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[128px]"></div>
      
      <main className="relative z-10">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
