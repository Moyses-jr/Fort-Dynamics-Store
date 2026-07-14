const NavigationPages = () => {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <a href="#lancamentos" className="hover-gold uppercase tracking-wide">
        Lançamentos
      </a>
      <a href="#camisetas" className="hover-gold uppercase tracking-wide">
        Camisetas
      </a>
      <a href="#moletons" className="hover-gold uppercase tracking-wide">
        Moletons
      </a>
      <a href="#uniformes" className="hover-gold uppercase tracking-wide">
        Uniformes
      </a>
      <a
        href="#premium"
        className="hover-gold uppercase tracking-wide text-fd-gold"
      >
        Premium
      </a>
      <a href="#personalizar" className="hover-gold uppercase tracking-wide">
        Personalizar
      </a>
    </nav>
  );
};

export default NavigationPages;
