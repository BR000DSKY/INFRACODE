"use client"

import HeroSection from "@/components/home/hero-section"
import FeaturesSection from "@/components/home/features-section"
import StatsSection from "@/components/home/stats-section"
import ProjectsSection from "@/components/home/projects-section"
import TopStudentsSection from "@/components/home/top-students-section"
import CTASection from "@/components/home/cta-section"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <ProjectsSection />
        <TopStudentsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
