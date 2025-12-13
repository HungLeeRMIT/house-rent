import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, Home, User, LogOut, PlusCircle } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">RentMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/properties" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Properties
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Actions */}
            {user ? (
              <>
                {user.role === 'LANDLORD' && (
                  <Button
                    size="sm"
                    onClick={() => navigate('/properties/new')}
                    className="hidden md:inline-flex"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Property
                  </Button>
                )}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary rounded-md">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden md:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="hidden md:inline-flex"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
              <div className="pt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 py-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                    {user.role === 'LANDLORD' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          navigate('/properties/new')
                          setMobileMenuOpen(false)
                        }}
                        className="w-full"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Property
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate('/login')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigate('/register')
                        setMobileMenuOpen(false)
                      }}
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

