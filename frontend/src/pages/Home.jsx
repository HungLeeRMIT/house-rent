import Hero from '@/components/landing/Hero'
import TrustBadges from '@/components/landing/TrustBadges'
import PropertyShowcase from '@/components/landing/PropertyShowcase'
import Features from '@/components/landing/Features'
import VideoDemo from '@/components/landing/VideoDemo'
import UserRoles from '@/components/landing/UserRoles'
import InteractiveStats from '@/components/landing/InteractiveStats'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import Newsletter from '@/components/landing/Newsletter'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustBadges />
      <PropertyShowcase />
      <Features />
      <VideoDemo />
      <UserRoles />
      <InteractiveStats />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default Home

