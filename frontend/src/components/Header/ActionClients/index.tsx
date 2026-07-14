import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  cartItemsCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  handleSerchOpen: () => void;
  handleMobileMenuOpen: () => void;
  mobileMenuOpen: boolean;
};

const ActionClients = ({
  cartItemsCount,
  onCartClick,
  onLoginClick,
  isLoggedIn,
  handleSerchOpen,
  handleMobileMenuOpen,
  mobileMenuOpen,
}: HeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleSerchOpen}
        className="p-2 hover:text-fd-gold transition-colors"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={onLoginClick}
        className="p-2 hover:text-fd-gold transition-colors"
        aria-label={isLoggedIn ? "Minha Conta" : "Entrar"}
      >
        <User className="w-5 h-5" />
      </button>

      <button
        onClick={onCartClick}
        className="relative p-2 hover:text-fd-gold transition-colors"
        aria-label="Carrinho"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-fd-gold text-fd-black text-xs rounded-full flex items-center justify-center font-bold">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => handleMobileMenuOpen}
        className="lg:hidden p-2 hover:text-fd-gold transition-colors"
        aria-label="Menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default ActionClients;
