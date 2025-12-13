import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertyList from './pages/PropertyList'
import PropertyDetails from './pages/PropertyDetails'
import PropertyForm from './pages/PropertyForm'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const { user } = useAuthStore()

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/properties/new" element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            } />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/properties/:id/edit" element={
              <ProtectedRoute>
                <PropertyForm />
              </ProtectedRoute>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

