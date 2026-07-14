import { useState } from "react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import Logo from "./FDLogo";
import NavigationPages from "./NavigationPages";
import ActionClients from "./ActionClients";

type HeaderProps = {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
};

export function Header({
  cartItemsCount,
  onCartClick,
  onLoginClick,
  isLoggedIn,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const handleSerchOpen = () => {
    setSearchOpen(!searchOpen);
  };
  const hanldeMobileMenuOpen = () => {
    setSearchOpen(!searchOpen);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-fd-black/95 backdrop-blur-md border-b border-fd-gray-lighter">
      <div className="container-fd">
        <div className="flex items-center justify-between h-20">
          <Logo />

          <NavigationPages />

          <ActionClients
            cartItemsCount={cartItemsCount}
            onCartClick={onCartClick}
            onLoginClick={onLoginClick}
            isLoggedIn={isLoggedIn}
            mobileMenuOpen={mobileMenuOpen}
            handleSerchOpen={handleSerchOpen}
            handleMobileMenuOpen={hanldeMobileMenuOpen}
          />

          <div />
          {/* Search Bar */}
          {searchOpen && (
            <div className="py-4 border-t border-fd-gray-lighter">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full bg-fd-gray px-4 py-3 rounded text-fd-white placeholder:text-fd-white/40 focus:outline-none focus:ring-2 focus:ring-fd-gold"
                autoFocus
              />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-6 border-t border-fd-gray-lighter">
              <div className="flex flex-col gap-4">
                <a
                  href="#lancamentos"
                  className="hover-gold uppercase tracking-wide py-2"
                >
                  Lançamentos
                </a>
                <a
                  href="#camisetas"
                  className="hover-gold uppercase tracking-wide py-2"
                >
                  Camisetas
                </a>
                <a
                  href="#moletons"
                  className="hover-gold uppercase tracking-wide py-2"
                >
                  Moletons
                </a>
                <a
                  href="#uniformes"
                  className="hover-gold uppercase tracking-wide py-2"
                >
                  Uniformes
                </a>
                <a
                  href="#premium"
                  className="hover-gold uppercase tracking-wide text-fd-gold py-2"
                >
                  Premium
                </a>
                <a
                  href="#personalizar"
                  className="hover-gold uppercase tracking-wide py-2"
                >
                  Personalizar
                </a>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
