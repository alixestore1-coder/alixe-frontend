import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [health, setHealth] = useState("Yükleniyor...");
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("admin@alixe.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("alixe_token") || "");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");

  // Backend health kontrol
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setHealth(`API OK ✅ (${JSON.stringify(data)})`))
      .catch(() => setHealth("API'a ulaşılamadı ❌"));
  }, []);

  // Ürünleri çek
  const loadProducts = () => {
    fetch(`${API_BASE}/products`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Giriş başarısız");
      }

      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("alixe_token", data.access_token);
      setMessage("Admin girişi başarılı ✅");
    } catch (err) {
      setMessage(err.message || "Hata oluştu");
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("alixe_token");
    setMessage("Çıkış yapıldı.");
  };

  // Yeni ürün ekle
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Önce admin girişi yapmalısın.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image_url: newProduct.image_url || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Ürün eklenemedi");
      }

      setMessage("Ürün eklendi ✅");
      setNewProduct({ name: "", description: "", price: "", image_url: "" });
      loadProducts();
    } catch (err) {
      setMessage(err.message || "Hata oluştu");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wider">
            A&apos;LIXE STORE
          </h1>
          <p className="text-xs text-slate-400">
            Minimal. Clean. Premium streetwear.
          </p>
        </div>
        <div className="text-xs text-right text-slate-400">
          <div>{health}</div>
          <div className="text-[10px]">
            API_BASE: <span className="text-emerald-400">{API_BASE}</span>
          </div>
        </div>
      </header>

      {/* Ana içerik */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6 px-6 py-6">
        {/* Mağaza / Ürünler */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Mağaza Vitrini</h2>
          {products.length === 0 ? (
            <p className="text-sm text-slate-400">
              Henüz ürün yok. Admin panelinden ürün eklediğinde burada
              görünecek.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-800 rounded-xl p-3 flex flex-col gap-2 bg-slate-900/40"
                >
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">
                    {p.description}
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">
                    {p.price} ₺
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin Paneli */}
        <aside className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Admin Panel</h2>

          {!token ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
              <input
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
              />
              <button
                type="submit"
                className="mt-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded px-2 py-1"
              >
                Admin Giriş
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-emerald-400">
                Admin girişi aktif ✅
              </div>
              <button
                onClick={handleLogout}
                className="text-[10px] px-2 py-1 border border-slate-700 rounded"
              >
                Çıkış
              </button>
            </div>
          )}

          <form onSubmit={handleAddProduct} className="flex flex-col gap-2 mt-2">
            <input
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
              placeholder="Ürün adı"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <textarea
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
              placeholder="Açıklama"
              rows={2}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <input
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
              placeholder="Fiyat"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs"
              placeholder="(İsteğe bağlı) Görsel URL"
              value={newProduct.image_url}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image_url: e.target.value })
              }
            />
            <button
              type="submit"
              className="mt-1 bg-slate-100 text-slate-950 text-xs font-semibold rounded px-2 py-1"
            >
              Ürün Ekle
            </button>
          </form>

          {message && (
            <div className="text-[10px] text-emerald-400 mt-1">{message}</div>
          )}
        </aside>
      </main>

      <footer className="px-6 py-3 text-[10px] text-slate-500 border-t border-slate-900">
        A&apos;LIXE · Internal alpha build · Powered by FastAPI & React
      </footer>
    </div>
  );
}

export default App;