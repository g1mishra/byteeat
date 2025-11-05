import styles from "@/styles/home.module.css"
import { Star } from "lucide-react"
import React from "react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      position: "Owner",
      restaurant: "Urban Plates Bistro",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      quote:
        "ByteEat has transformed how we operate. Our customers love the digital menu experience, and our staff can focus more on service quality.",
    },
    {
      name: "Michael Rodriguez",
      position: "General Manager",
      restaurant: "The Garden Kitchen",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      quote:
        "The analytics and insights we get from ByteEat have helped us optimize our menu and increase our revenue by 30%.",
    },
    {
      name: "Emily Thompson",
      position: "Operations Director",
      restaurant: "Fusion Eats",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
      quote:
        "Implementing ByteEat was the best decision we made. The QR ordering system has significantly reduced wait times and improved accuracy.",
    },
  ]

  return (
    <div className={`py-24 ${styles.sectionGradient}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className="text-lg text-gray-600">Trusted by restaurants across India</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`${styles.testimonialCard} p-8`}>
              <div className="mb-6 flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                  <p className="text-sm text-indigo-600">{testimonial.restaurant}</p>
                </div>
              </div>
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-600">&ldquo;{testimonial.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
