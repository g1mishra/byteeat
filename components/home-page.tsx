import Contact from "./home/Contact"
import Features from "./home/Features"
import Footer from "./home/Footer"
import Hero from "./home/Hero"
import Navbar from "./home/Navbar"
import Pricing from "./home/Pricing"
import Stats from "./home/Stats"

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero id="hero" />
        <Stats id="stats" />
        <Features id="features" />
        <Pricing id="pricing" />
        <Contact id="contact" />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
