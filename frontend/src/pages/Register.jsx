import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Home, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'TENANT',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      })
    }
    // Clear general error
    if (error) {
      setError('')
    }
  }

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    })
    if (fieldErrors.role) {
      setFieldErrors({
        ...fieldErrors,
        role: '',
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await authAPI.register(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } })
      }, 2000)
    } catch (err) {
      const errorData = err.response?.data
      
      // Handle validation errors with field-specific messages
      if (errorData?.errors) {
        setFieldErrors(errorData.errors)
        setError(errorData.message || 'Please fix the errors below')
      } else {
        // Handle other errors (like username/email already taken)
        setError(errorData?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'TENANT', label: 'Tenant - Looking for properties' },
    { value: 'LANDLORD', label: 'Landlord - I own properties' },
    { value: 'PROPERTY_MANAGER', label: 'Property Manager' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <Home className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">RentMate</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join RentMate to find your perfect property or manage listings
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success && (
              <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Registration successful! Redirecting to login...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  I am a <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleRoleChange}
                  disabled={loading || success}
                >
                  <SelectTrigger className={`h-11 ${fieldErrors.role ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.role && (
                  <p className="text-sm text-destructive">{fieldErrors.role}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading || success}
                    className={`h-11 ${fieldErrors.firstName ? 'border-destructive' : ''}`}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-sm text-destructive">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading || success}
                    className={`h-11 ${fieldErrors.lastName ? 'border-destructive' : ''}`}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-sm text-destructive">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading || success}
                  className={`h-11 ${fieldErrors.username ? 'border-destructive' : ''}`}
                />
                {fieldErrors.username && (
                  <p className="text-sm text-destructive">{fieldErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading || success}
                  className={`h-11 ${fieldErrors.email ? 'border-destructive' : ''}`}
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading || success}
                  className={`h-11 ${fieldErrors.phoneNumber ? 'border-destructive' : ''}`}
                />
                {fieldErrors.phoneNumber && (
                  <p className="text-sm text-destructive">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading || success}
                  className={`h-11 ${fieldErrors.password ? 'border-destructive' : ''}`}
                />
                {fieldErrors.password ? (
                  <p className="text-sm text-destructive">{fieldErrors.password}</p>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>Password must be at least 12 characters and include uppercase, lowercase, number, and special character</span>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Success!
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              <Link to="/" className="hover:text-primary hover:underline">
                ← Back to home
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Quick Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default Register
