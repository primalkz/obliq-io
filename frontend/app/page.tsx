import Nav from './components/nav'
import Hero from './components/hero'
import Features from './components/features'
import PullQuote from './components/pullquote'
import Testimonials from './components/testimonials'
import Pricing from './components/pricing'
import Footer from './components/footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <PullQuote />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  )
}
