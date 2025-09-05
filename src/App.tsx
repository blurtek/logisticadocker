import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🚚 MueblesWOW Logística
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Sistema de gestión de entregas y recogidas
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-green-600 font-semibold">
                    ✅ Aplicación dockerizada y lista para Coolify
                  </p>
                </div>
              </div>
            </div>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
