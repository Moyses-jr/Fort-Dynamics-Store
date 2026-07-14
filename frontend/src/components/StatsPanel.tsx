import { TrendingUp, Package, Users, DollarSign, Star, Zap } from 'lucide-react';

type StatsPanelProps = {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    averageRating: number;
    newOrdersToday: number;
    aiGenerationsToday: number;
  };
};

export function StatsPanel({ stats }: StatsPanelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const statCards = [
    {
      icon: Package,
      label: 'Total de Pedidos',
      value: stats.totalOrders.toString(),
      subtitle: `+${stats.newOrdersToday} hoje`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      icon: DollarSign,
      label: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      subtitle: 'Este mês',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      icon: Users,
      label: 'Clientes',
      value: stats.totalCustomers.toString(),
      subtitle: 'Cadastrados',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      icon: Star,
      label: 'Avaliação Média',
      value: stats.averageRating.toFixed(1),
      subtitle: 'De 5.0 estrelas',
      color: 'text-fd-gold',
      bgColor: 'bg-fd-gold/10',
    },
    {
      icon: Zap,
      label: 'Gerações IA',
      value: stats.aiGenerationsToday.toString(),
      subtitle: 'Hoje',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
    },
    {
      icon: TrendingUp,
      label: 'Crescimento',
      value: '+23%',
      subtitle: 'vs. mês anterior',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
    },
  ];

  return (
    <section className="py-12 bg-fd-gray/30">
      <div className="container-fd">
        <div className="text-center mb-10">
          <h3 className="text-fd-white font-display text-2xl mb-2">
            Métricas em Tempo Real
          </h3>
          <p className="text-fd-white/60">Acompanhe o desempenho do ecossistema FD Store</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card-premium rounded-lg p-4 text-center"
              >
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-display ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-fd-white uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-fd-white/40">
                  {stat.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
