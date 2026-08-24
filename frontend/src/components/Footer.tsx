import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-fd-black pt-10  border-t border-fd-gray-lighter">
      <div className="container-fd py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 gold-gradient flex items-center justify-center">
                <span className="text-fd-black font-display text-2xl">FD</span>
              </div>
              <div>
                <div className="font-display text-xl text-fd-gold">
                  FD STORE
                </div>
                <div className="text-[10px] text-fd-white/60 tracking-widest -mt-1">
                  FORT DYNAMIC
                </div>
              </div>
            </div>
            <p className="text-fd-white/60 text-sm mb-4">
              Vista-se com autoridade. Streetwear premium com tecnologia e
              estilo únicos.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/fdstore.ofc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-fd-gray hover:bg-fd-gold hover:text-fd-black transition-all rounded"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-fd-gray hover:bg-fd-gold hover:text-fd-black transition-all rounded"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-fd-gray hover:bg-fd-gold hover:text-fd-black transition-all rounded"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg text-fd-white mb-4">Loja</h4>
            <ul className="space-y-2 text-sm text-fd-white/60">
              <li>
                <a href="#lancamentos" className="hover-gold">
                  Lançamentos
                </a>
              </li>
              <li>
                <a href="#camisetas" className="hover-gold">
                  Camisetas
                </a>
              </li>
              <li>
                <a href="#moletons" className="hover-gold">
                  Moletons
                </a>
              </li>
              <li>
                <a href="#uniformes" className="hover-gold">
                  Uniformes
                </a>
              </li>
              <li>
                <a href="#premium" className="hover-gold">
                  Premium
                </a>
              </li>
              <li>
                <a href="#personalizar" className="hover-gold">
                  Personalizar
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-lg text-fd-white mb-4">
              Informações
            </h4>
            <ul className="space-y-2 text-sm text-fd-white/60">
              <li>
                <a href="#" className="hover-gold">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="hover-gold">
                  Tabela de Tamanhos
                </a>
              </li>
              <li>
                <a href="#" className="hover-gold">
                  Política de Troca
                </a>
              </li>
              <li>
                <a href="#" className="hover-gold">
                  Frete e Entrega
                </a>
              </li>
              <li>
                <a href="#" className="hover-gold">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover-gold">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-fd-white mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-fd-white/60">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-fd-gold flex-shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-fd-gold flex-shrink-0" />
                <span>contato@fdstore.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-fd-gold flex-shrink-0" />
                <span>
                  São Paulo, SP
                  <br />
                  Brasil
                </span>
              </li>
            </ul>

            <div className="mt-4">
              <h5 className="text-fd-white text-sm mb-2">Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 bg-fd-gray px-3 py-2 text-sm text-fd-white placeholder:text-fd-white/40 focus:outline-none focus:ring-2 focus:ring-fd-gold rounded"
                />
                <button className="px-4 py-2 bg-fd-gold text-fd-black hover:bg-fd-gold-light transition-colors rounded">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-fd-gray-lighter flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-fd-white/40">
          <p>
            &copy; 2024 FD Store | Fort Dynamic. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
              alt="Mastercard"
              className="h-6 opacity-60"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-6 opacity-60"
            />
            <span className="text-fd-gold">PIX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
