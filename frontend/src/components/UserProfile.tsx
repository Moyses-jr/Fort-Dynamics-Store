import { X, Package, Heart, MapPin, User as UserIcon, LogOut } from 'lucide-react';
import type { User, Order } from '../types';

type UserProfileProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
  favorites: string[];
  onLogout: () => void;
};

export function UserProfile({
  isOpen,
  onClose,
  user,
  orders,
  favorites,
  onLogout,
}: UserProfileProps) {
  if (!isOpen) return null;

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'text-yellow-400',
      confirmed: 'text-blue-400',
      production: 'text-purple-400',
      shipping: 'text-orange-400',
      delivered: 'text-green-400',
      cancelled: 'text-red-400',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      production: 'Em Produção',
      shipping: 'Em Transporte',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-fd-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[600px] bg-fd-gray z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-fd-gray-lighter">
          <h2 className="text-fd-white">Minha Conta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-fd-gold transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-gold">
          {user ? (
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="card-premium p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-fd-gold flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-fd-black" />
                  </div>
                  <div>
                    <h3 className="text-fd-white font-display text-xl">{user.name}</h3>
                    <p className="text-fd-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <button onClick={onLogout} className="w-full btn-secondary py-2 text-sm">
                  <LogOut className="inline-block w-4 h-4 mr-2" />
                  Sair
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card-premium p-4 rounded-lg text-center">
                  <div className="text-2xl font-display text-fd-gold mb-1">{orders.length}</div>
                  <div className="text-xs text-fd-white/60 uppercase">Pedidos</div>
                </div>
                <div className="card-premium p-4 rounded-lg text-center">
                  <div className="text-2xl font-display text-fd-gold mb-1">{favorites.length}</div>
                  <div className="text-xs text-fd-white/60 uppercase">Favoritos</div>
                </div>
                <div className="card-premium p-4 rounded-lg text-center">
                  <div className="text-2xl font-display text-fd-gold mb-1">{user.addresses.length}</div>
                  <div className="text-xs text-fd-white/60 uppercase">Endereços</div>
                </div>
              </div>

              {/* Orders */}
              <div>
                <h3 className="font-display text-lg text-fd-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-fd-gold" />
                  Meus Pedidos
                </h3>
                {orders.length === 0 ? (
                  <div className="card-premium p-6 rounded-lg text-center">
                    <Package className="w-12 h-12 text-fd-gold/20 mx-auto mb-3" />
                    <p className="text-fd-white/60">Nenhum pedido ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="card-premium p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-fd-white font-display">Pedido #{order.id}</div>
                            <div className="text-xs text-fd-white/60">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <div className={`text-sm uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-fd-white/60">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </span>
                          <span className="text-fd-gold font-display text-lg">
                            R$ {order.total.toFixed(2)}
                          </span>
                        </div>

                        {order.trackingCode && (
                          <div className="mt-3 pt-3 border-t border-fd-gray-lighter">
                            <div className="text-xs text-fd-white/60 mb-1">Código de rastreamento:</div>
                            <div className="text-sm text-fd-gold">{order.trackingCode}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div>
                <h3 className="font-display text-lg text-fd-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-fd-gold" />
                  Meus Endereços
                </h3>
                <div className="space-y-3">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="card-premium p-4 rounded-lg">
                      {address.isDefault && (
                        <span className="inline-block px-2 py-1 bg-fd-gold/20 text-fd-gold text-xs uppercase tracking-wider rounded mb-2">
                          Principal
                        </span>
                      )}
                      <div className="text-fd-white text-sm">
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                      </div>
                      <div className="text-fd-white/60 text-xs mt-1">
                        {address.neighborhood}, {address.city} - {address.state}
                      </div>
                      <div className="text-fd-white/60 text-xs">
                        CEP: {address.zipCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <UserIcon className="w-20 h-20 text-fd-gold/20 mb-4" />
              <h3 className="text-fd-white text-xl mb-2">Entre na sua conta</h3>
              <p className="text-fd-white/60 mb-6">
                Faça login para acessar seus pedidos, favoritos e muito mais.
              </p>
              <button className="btn-primary px-8 py-3">
                Entrar
              </button>
              <button className="btn-secondary px-8 py-3 mt-3">
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
