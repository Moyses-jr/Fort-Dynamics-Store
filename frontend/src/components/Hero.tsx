import { ArrowRight } from "lucide-react";

type HeroProps = {
  onCTAClick: () => void;
};

export function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1760736534395-f020b0500f3b?w=1920"
          alt="FD Store Hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-fd-black/80 via-fd-black/50 to-fd-black"></div>
      </div>

      {/* Content */}
      <div className="container-fd relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fd-gold/10 border border-fd-gold/30 rounded-full mt-8 ">
            <span className="w-2 h-2 bg-fd-gold rounded-full animate-pulse"></span>
            <span className="text-fd-gold text-sm tracking-widest uppercase">
              Nova Coleção 2026
            </span>
          </div>

          <div className="flex justify-center ">
            <img
              src="/white_coroa.svg"
              alt="FD Store Logo"
              className="w-50 h-50 object-contain"
            />
          </div>

          {/* Main Heading */}
          <h1 className="mb-1">
            <span className="block text-fd-white">
              <span style={{ color: "#F5C542" }}>F</span>ORT{" "}
              <span style={{ color: "#F5C542" }}>D</span>YNAMIC
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-fd-white/80 mb-12 max-w-2xl mx-auto">
            Moda Store & Personalizados
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCTAClick}
              className="btn-primary btn-primary-lg min-w-[200px]"
            >
              Explorar Coleção
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("personalizar")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-secondary min-w-[200px]"
            >
              Criar Minha Peça
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display text-fd-gold mb-2">
                500+
              </div>
              <div className="text-sm text-fd-white/60 uppercase tracking-wide">
                Produtos
              </div>
            </div>
            <div className="text-center border-x border-fd-gray-lighter">
              <div className="text-3xl md:text-4xl font-display text-fd-gold mb-2">
                15K+
              </div>
              <div className="text-sm text-fd-white/60 uppercase tracking-wide">
                Clientes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-display text-fd-gold mb-2">
                4.9
              </div>
              <div className="text-sm text-fd-white/60 uppercase tracking-wide">
                Avaliação
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
