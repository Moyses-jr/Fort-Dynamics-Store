import { useState } from "react";
import { useForm } from "react-hook-form";
import {
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
} from "lucide-react";

import "../../styles/adminStyles.css";
import {
  useAdminOrders,
  useAdminStats,
  useAdminUsers,
} from "../../hooks/useAdmin";
import { ApiProduct, useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

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

function Admin() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState("");
  // const [productList, setProductList] = useState(products);

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
  const { stats } = useAdminStats();
  const { orders } = useAdminOrders();

  return (
    <>
      {/* ...cabeçalho igual... */}
      <div className="stat-grid">
        <StatCard
          icon={CircleDollarSign}
          label="Vendas no mês"
          value={`R$ ${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          trend="—"
        />
        <StatCard
          icon={ShoppingBag}
          label="Pedidos"
          value={String(stats?.totalOrders ?? 0)}
          trend="—"
        />
        <StatCard
          icon={Users}
          label="Clientes"
          value={String(stats?.totalCustomers ?? 0)}
          trend="—"
        />
        <StatCard
          icon={Box}
          label="Pedidos hoje"
          value={String(stats?.newOrdersToday ?? 0)}
          trend="—"
        />
      </div>
      {/* ... */}
      <div className="mini-orders">
        {orders.slice(0, 4).map((order) => (
          <div className="mini-order" key={order.id}>
            <span className="order-symbol">
              <ShoppingBag size={15} />
            </span>
            <div>
              <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
              <small>{order.user.name}</small>
            </div>
            <span className="order-value">
              R$ {Number(order.total).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </>
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
  const { orders } = useAdminOrders();
  return (
    <>
      {/* ...cabeçalho igual... */}
      <table>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
              </td>
              <td>{order.user.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString("pt-BR")}</td>
              <td>
                <strong>R$ {Number(order.total).toFixed(2)}</strong>
              </td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td>
                <button
                  className="row-menu"
                  onClick={() => onNotify(`Pedido selecionado`)}
                >
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
function Products({
  showForm,
  setShowForm,
  onNotify,
}: {
  showForm: boolean;
  setShowForm: (open: boolean) => void;
  onNotify: (message: string) => void;
}) {
  const { categories } = useCategories();
  const { products: productList, isLoading } = useProducts({ limit: 100 });
  const { register, handleSubmit, reset } = useForm<ProductForm>();
  const submit = (data: ProductForm) => {
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
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
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
                  <td>{product.category.name}</td>
                  <td>
                    <strong>{product.priceBoth}</strong>
                  </td>
                  <td>
                    {product.variants?.reduce(
                      (acc, variant) => acc + variant.stock,
                      0,
                    )}{" "}
                    un.
                  </td>
                  <td>
                    <StatusBadge
                      status={product.available ? "Disponivel" : "Sem estoque"}
                    />
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
  const { users } = useAdminUsers();
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
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td>
                    <div className="customer-cell">
                      <span className="avatar">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <strong>{user.name}</strong>
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

export default Admin;
