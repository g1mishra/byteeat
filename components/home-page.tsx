import Benefits from "./home/Benefits"
import Contact from "./home/Contact"
import Features from "./home/Features"
import Footer from "./home/Footer"
import Hero from "./home/Hero"
import Navbar from "./home/Navbar"
import Pricing from "./home/Pricing"
import Process from "./home/Process"
import Solutions from "./home/Solutions"
import Stats from "./home/Stats"

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero id="hero" />
        <Stats id="stats" />
        <Solutions id="solutions" />
        <Features id="features" />
        <Process id="process" />
        <Benefits id="benefits" />
        <Pricing id="pricing" />
        <Contact id="contact" />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
