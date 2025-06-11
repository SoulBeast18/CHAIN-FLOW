import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Blog from './components/Blog'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLayout from './components/admin/AdminLayout'
import ManagerLayout from './components/admin/ManagerLayout'
import AdminDashboard from './pages/admin/Dashboard'
import ManagerDashboard from './pages/manager/Dashboard'
import DemandForecast from './components/admin/DemandForecast'
import SupplierPortal from './components/admin/SupplierPortal'
import Reports from './pages/user/Reports'
import Inventory from './pages/user/Inventory'
import Shipments from './pages/user/Shipments'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative">
          <Header />
          <div className="flex-grow pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={
                <main>
                  <Hero />
                  <Blog />
                </main>
              } />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <RequireAuth permissions={['manage_users', 'manage_roles']}>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* Protected Manager Routes */}
              <Route
                path="/manager/*"
                element={
                  <RequireAuth permissions={['read', 'write']}>
                    <ManagerLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<ManagerDashboard />} />
                <Route path="forecast" element={<DemandForecast />} />
                <Route path="suppliers" element={<SupplierPortal />} />
                <Route path="reports" element={<Reports />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="shipments" element={<Shipments />} />
              </Route>
            </Routes>
          </div>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
