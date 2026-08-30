import { Star, Quote } from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
};

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-10 bg-fd-gray/30">
      <div className="container-fd">
        <div className="text-center mb-12">
          <h2 className="text-fd-white mb-4">O Que Dizem Nossos Clientes</h2>
          <div className="w-24 h-1 gold-gradient mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="card-premium rounded-lg p-6 relative"
            >
              <Quote className="w-10 h-10 text-fd-gold/20 mb-4" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-fd-gold text-fd-gold"
                        : "text-fd-gray-lighter"
                    }`}
                  />
                ))}
              </div>

              <p className="text-fd-white/80 mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-fd-gray-lighter">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-fd-white font-display text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-fd-gold text-xs">Cliente Verificado</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
