import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BarChart3,
  Bell,
  Box,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FileImage,
  LayoutDashboard,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Users,
  X,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";

import "../../styles/adminStyles.css";

type Page =
  | "dashboard"
  | "pedidos"
  | "produtos"
  | "clientes"
  | "artes"
  | "configuracoes";

type ProductForm = {
  name: string;
  category: string;
  price: string;
  stock: string;
};

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "artes", label: "Artes", icon: FileImage },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

const orders = [
  {
    id: "#FD-1048",
    customer: "Mariana Costa",
    date: "Hoje, 09:42",
    value: "R$ 189,90",
    status: "Em produção",
  },
  {
    id: "#FD-1047",
    customer: "João Vitor",
    date: "Hoje, 08:16",
    value: "R$ 249,00",
    status: "Pago",
  },
  {
    id: "#FD-1046",
    customer: "Ana Beatriz",
    date: "Ontem, 17:34",
    value: "R$ 99,90",
    status: "Enviado",
  },
  {
    id: "#FD-1045",
    customer: "Lucas Almeida",
    date: "Ontem, 14:12",
    value: "R$ 329,80",
    status: "Pago",
  },
];

type Product = {
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
};

const products: Product[] = [
  {
    name: "Camiseta Oversized FD",
    category: "Camisetas",
    price: "R$ 89,90",
    stock: 32,
    status: "Ativo",
  },
  {
    name: "Moletom Essential Black",
    category: "Moletons",
    price: "R$ 179,90",
    stock: 12,
    status: "Ativo",
  },
  {
    name: "Camiseta Classic White",
    category: "Camisetas",
    price: "R$ 79,90",
    stock: 4,
    status: "Baixo estoque",
  },
  {
    name: "Boné Signature",
    category: "Acessórios",
    price: "R$ 59,90",
    stock: 0,
    status: "Esgotado",
  },
];

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState("");
  const [productList, setProductList] = useState(products);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const navigate = (next: Page) => {
    setPage(next);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">FD</span>
          <span>FD STORE</span>
        </div>
        <div className="store-switcher">
          <span className="store-dot" />
          <span>Loja principal</span>
          <ChevronDown size={15} />
        </div>
        <nav className="main-nav" aria-label="Navegação principal">
          <span className="nav-label">GERAL</span>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => navigate(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "pedidos" && <span className="nav-count">4</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">?</span>
            <div>
              <strong>Precisa de ajuda?</strong>
              <small>Fale com nosso suporte</small>
            </div>
          </div>
          <button className="profile">
            <span className="avatar">MC</span>
            <span className="profile-copy">
              <strong>Marcos Costa</strong>
              <small>Administrador</small>
            </span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menu"
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>Painel</span>
            <span>/</span>
            <strong>{navItems.find((item) => item.id === page)?.label}</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-button"
              aria-label="Notificações"
              onClick={() => notify("Você não tem novas notificações")}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="top-avatar">MC</div>
          </div>
        </header>
        <div className="page-wrap">
          {page === "dashboard" && (
            <Dashboard onNavigate={navigate} onNotify={notify} />
          )}
          {page === "pedidos" && <Orders onNotify={notify} />}
          {page === "produtos" && (
            <Products
              productList={productList}
              setProductList={setProductList}
              showForm={showProductForm}
              setShowForm={setShowProductForm}
              onNotify={notify}
            />
          )}
          {page === "clientes" && <Customers />}
          {page === "artes" && <Artwork onNotify={notify} />}
          {page === "configuracoes" && <SettingsPage onNotify={notify} />}
        </div>
      </main>
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow || "VISÃO GERAL"}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  positive = true,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={19} />
      </div>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <span className={`trend ${positive ? "positive" : "negative"}`}>
        {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        {trend}
        <small> vs. mês anterior</small>
      </span>
    </div>
  );
}
function Dashboard({
  onNavigate,
  onNotify,
}: {
  onNavigate: (page: Page) => void;
  onNotify: (message: string) => void;
}) {
  return (
    <>
      <PageHeading
        title=""
        description=""
        action={
          <button
            className="primary-button"
            onClick={() => onNavigate("produtos")}
          >
            <Plus size={17} /> Novo produto
          </button>
        }
      />
      <div className="stat-grid">
        <StatCard
          icon={CircleDollarSign}
          label="Vendas no mês"
          value="R$ 24.580,00"
          trend="18,4%"
        />
        <StatCard
          icon={ShoppingBag}
          label="Pedidos"
          value="184"
          trend="12,8%"
        />
        <StatCard icon={Users} label="Clientes" value="1.248" trend="8,2%" />
        <StatCard
          icon={Box}
          label="Ticket médio"
          value="R$ 133,58"
          trend="4,6%"
          positive={false}
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Visão geral</h2>
              <p>Receita dos últimos 7 dias</p>
            </div>
            <button className="select-button">
              Últimos 7 dias <ChevronDown size={15} />
            </button>
          </div>
          <div className="chart">
            <div className="chart-y">
              <span>R$ 5k</span>
              <span>R$ 4k</span>
              <span>R$ 3k</span>
              <span>R$ 2k</span>
              <span>R$ 1k</span>
              <span>R$ 0</span>
            </div>
            <div className="chart-area">
              <div className="grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 650 205"
                preserveAspectRatio="none"
                className="line-chart"
              >
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#e1ff58" stopOpacity=".25" />
                    <stop offset="100%" stopColor="#e1ff58" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,160 C35,148 55,165 90,139 S145,151 180,107 S235,119 270,91 S320,120 365,76 S420,96 455,58 S500,88 545,53 S600,34 650,10 L650,205 L0,205Z"
                  fill="url(#fill)"
                />
                <path
                  d="M0,160 C35,148 55,165 90,139 S145,151 180,107 S235,119 270,91 S320,120 365,76 S420,96 455,58 S500,88 545,53 S600,34 650,10"
                  fill="none"
                  stroke="#d8f957"
                  strokeWidth="3"
                />
              </svg>
              <div className="chart-x">
                <span>10 Jun</span>
                <span>11 Jun</span>
                <span>12 Jun</span>
                <span>13 Jun</span>
                <span>14 Jun</span>
                <span>15 Jun</span>
                <span>16 Jun</span>
              </div>
            </div>
          </div>
        </section>
        <section className="panel orders-panel">
          <div className="panel-heading">
            <div>
              <h2>Pedidos recentes</h2>
              <p>Últimas movimentações</p>
            </div>
            <button
              className="text-button"
              onClick={() => onNavigate("pedidos")}
            >
              Ver todos <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="mini-orders">
            {orders.slice(0, 4).map((order) => (
              <div className="mini-order" key={order.id}>
                <span className="order-symbol">
                  <ShoppingBag size={15} />
                </span>
                <div>
                  <strong>{order.id}</strong>
                  <small>{order.customer}</small>
                </div>
                <span className="order-value">{order.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel category-panel">
        <div className="panel-heading">
          <div>
            <h2>Produtos mais vendidos</h2>
            <p>Desempenho por categoria</p>
          </div>
          <button
            className="text-button"
            onClick={() => onNotify("Relatório exportado")}
          >
            Exportar <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="category-list">
          <CategoryRow
            label="Camisetas"
            value="58%"
            amount="142 vendas"
            width="58%"
            color="lime"
          />
          <CategoryRow
            label="Moletons"
            value="24%"
            amount="58 vendas"
            width="24%"
            color="purple"
          />
          <CategoryRow
            label="Acessórios"
            value="18%"
            amount="44 vendas"
            width="18%"
            color="orange"
          />
        </div>
      </section>
    </>
  );
}
function CategoryRow({
  label,
  value,
  amount,
  width,
  color,
}: {
  label: string;
  value: string;
  amount: string;
  width: string;
  color: string;
}) {
  return (
    <div className="category-row">
      <div className="category-meta">
        <strong>{label}</strong>
        <span>{amount}</span>
        <b>{value}</b>
      </div>
      <div className={`progress ${color}`}>
        <i style={{ width }} />
      </div>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </span>
  );
}
function Orders({ onNotify }: { onNotify: (message: string) => void }) {
  return (
    <>
      <PageHeading
        title="Pedidos"
        description="Acompanhe e gerencie todos os pedidos da sua loja."
        action={
          <button
            className="primary-button"
            onClick={() => onNotify("Filtro de pedidos aberto")}
          >
            <Search size={17} /> Buscar pedido
          </button>
        }
      />
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={17} />
            <input placeholder="Buscar por pedido ou cliente..." />
          </div>
          <button className="filter-button">
            Todos os status <ChevronDown size={15} />
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.concat(orders.slice(0, 2)).map((order, i) => (
                <tr key={`${order.id}-${i}`}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>
                    <strong>{order.value}</strong>
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <button
                      className="row-menu"
                      onClick={() => onNotify(`Pedido ${order.id} selecionado`)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function Products({
  productList,
  setProductList,
  showForm,
  setShowForm,
  onNotify,
}: {
  productList: Product[];
  setProductList: (products: Product[]) => void;
  showForm: boolean;
  setShowForm: (open: boolean) => void;
  onNotify: (message: string) => void;
}) {
  const { register, handleSubmit, reset } = useForm<ProductForm>();
  const submit = (data: ProductForm) => {
    setProductList([
      ...productList,
      {
        name: data.name,
        category: data.category,
        price: `R$ ${data.price || "0,00"}`,
        stock: Number(data.stock) || 0,
        status: Number(data.stock) > 0 ? "Ativo" : "Esgotado",
      },
    ]);
    reset();
    setShowForm(false);
    onNotify("Produto adicionado com sucesso");
  };
  return (
    <>
      <PageHeading
        title="Produtos"
        description="Gerencie o catálogo e o estoque da sua loja."
        action={
          <button
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}{" "}
            {showForm ? "Fechar formulário" : "Novo produto"}
          </button>
        }
      />
      {showForm && (
        <form className="panel product-form" onSubmit={handleSubmit(submit)}>
          <div className="form-heading">
            <div>
              <span className="eyebrow">CATÁLOGO</span>
              <h2>Novo produto</h2>
            </div>
            <span className="form-step">01 / 01</span>
          </div>
          <div className="form-grid">
            <label>
              Nome do produto
              <input
                {...register("name", { required: true })}
                placeholder="Ex.: Camiseta Signature"
              />
            </label>
            <label>
              Categoria
              <select {...register("category")}>
                <option>Camisetas</option>
                <option>Moletons</option>
                <option>Acessórios</option>
              </select>
            </label>
            <label>
              Preço
              <input {...register("price")} placeholder="89,90" />
            </label>
            <label>
              Estoque inicial
              <input type="number" {...register("stock")} placeholder="0" />
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              <Check size={17} /> Adicionar produto
            </button>
          </div>
        </form>
      )}
      <section className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <h2>Todos os produtos</h2>
            <p>{productList.length} produtos cadastrados</p>
          </div>
          <button className="filter-button">
            Todas as categorias <ChevronDown size={15} />
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.name}>
                  <td>
                    <div className="product-cell">
                      <span className="product-thumb">
                        <Package size={16} />
                      </span>
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <strong>{product.price}</strong>
                  </td>
                  <td>{product.stock} un.</td>
                  <td>
                    <StatusBadge status={product.status} />
                  </td>
                  <td>
                    <button
                      className="row-menu"
                      onClick={() => onNotify("Opções do produto abertas")}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function Customers() {
  return (
    <>
      <PageHeading
        title="Clientes"
        description="Conheça melhor quem compra na FD Store."
        action={
          <button className="secondary-button">
            <ArrowUpRight size={16} /> Exportar clientes
          </button>
        }
      />
      <div className="stat-grid customer-stats">
        <StatCard
          icon={Users}
          label="Total de clientes"
          value="1.248"
          trend="8,2%"
        />
        <StatCard
          icon={CircleDollarSign}
          label="Valor médio por cliente"
          value="R$ 412,30"
          trend="6,1%"
        />
        <StatCard
          icon={CreditCard}
          label="Clientes recorrentes"
          value="68%"
          trend="3,4%"
        />
      </div>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>Base de clientes</h2>
            <p>Clientes mais recentes</p>
          </div>
          <div className="search-field compact">
            <Search size={17} />
            <input placeholder="Buscar cliente..." />
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Pedidos</th>
                <th>Total gasto</th>
                <th>Última compra</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[
                "Mariana Costa",
                "João Vitor",
                "Ana Beatriz",
                "Lucas Almeida",
              ].map((name, i) => (
                <tr key={name}>
                  <td>
                    <div className="customer-cell">
                      <span className="avatar">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <strong>{name}</strong>
                    </div>
                  </td>
                  <td>{12 - i} pedidos</td>
                  <td>
                    <strong>R$ {[1280, 940, 760, 540][i]},00</strong>
                  </td>
                  <td>{i === 0 ? "Hoje" : `${i + 1} dias atrás`}</td>
                  <td>
                    <button className="row-menu">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function Artwork({ onNotify }: { onNotify: (message: string) => void }) {
  return (
    <>
      <PageHeading
        title="Artes"
        description="Organize os arquivos visuais dos seus produtos."
        action={
          <button
            className="primary-button"
            onClick={() => onNotify("Upload de arte iniciado")}
          >
            <Plus size={17} /> Enviar arte
          </button>
        }
      />
      <div className="art-grid">
        {[
          "Drop verão 2024",
          "Signature collection",
          "Campanha essentials",
          "Moodboard FD",
        ].map((title, i) => (
          <button
            className="art-card"
            key={title}
            onClick={() => onNotify(`${title} selecionado`)}
          >
            <div className={`art-preview art-${i}`}>
              <FileImage size={32} />
            </div>
            <div>
              <strong>{title}</strong>
              <small>
                {[8, 14, 6, 21][i]} arquivos · Atualizado há {i + 1} dias
              </small>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
function SettingsPage({ onNotify }: { onNotify: (message: string) => void }) {
  return (
    <>
      <PageHeading
        title="Configurações"
        description="Ajuste as preferências da sua operação."
      />
      <section className="settings-layout">
        <div className="settings-nav">
          <button className="settings-active">Dados da loja</button>
          <button>Notificações</button>
          <button>Equipe e acessos</button>
          <button>Integrações</button>
        </div>
        <form
          className="panel settings-form"
          onSubmit={(event) => {
            event.preventDefault();
            onNotify("Configurações salvas");
          }}
        >
          <div className="panel-heading">
            <div>
              <h2>Dados da loja</h2>
              <p>Essas informações aparecem no seu perfil público.</p>
            </div>
          </div>
          <label>
            Nome da loja
            <input defaultValue="FD Store" />
          </label>
          <label>
            Descrição
            <textarea
              defaultValue="Streetwear essencial para quem faz acontecer."
              rows={4}
            />
          </label>
          <div className="form-grid">
            <label>
              E-mail de contato
              <input defaultValue="contato@fdstore.com.br" />
            </label>
            <label>
              Telefone
              <input defaultValue="(11) 99999-0000" />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default App;
