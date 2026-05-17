import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Approach } from "@/components/sections/approach"
import { Services } from "@/components/sections/services"
import { Mission } from "@/components/sections/mission"
import { Testimonials } from "@/components/sections/testimonials"
import { FAQ } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Approach />
      <Services />
      <Mission />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
