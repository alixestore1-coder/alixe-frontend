import { useEffect, useState } from "react";

function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [email, setEmail] = useState("admin@alixe.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [msg, setMsg] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // API kontrol
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.json())
      .then((data) => setApiStatus(data))
      .catch(() => setApiStatus({ error: true }));
  }, [API_BASE]);

  // Ürünleri çek
  const loadProducts = () => {
    fetch(`${API_BASE}/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Giriş
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setMsg("Admin girişi başarılı ✅");
      } else {
        setMsg(data.detail || "Giriş başarısız");
      }
    } catch (err) {
      setMsg("Bağlantı hatası");
    }
  };

  // Ürün ekle
  const handleAddProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Ürün eklendi ✅");
        setNewProduct({ title: "", description: "", price: "", image_url: "" });
        loadProducts();
      } else {
        setMsg(data.detail || "Ürün ekleme başarısız ❌");
      }
    } catch (err) {
      setMsg("Bağlantı hatası");
    }
  };

  // Çıkış
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMsg("Çıkış yapıldı");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">A'LIXE STORE</h1>
      <p className="text-center text-slate-400 mb-8">
        Minimal. Clean. Premium streetwear.
      </p>

      {/* API Durumu */}
      <div className="text-right text-xs text-slate-400 mb-4">
        API_BASE: <span className="text-emerald-400">{API_BASE}</span>
        <br />
        {apiStatus?.status === "ok" ? (
          <span className="text-emerald-400">API OK ✅</span>
        ) : (
          <span className="text-rose-400">API'ya ulaşılamadı ❌</span>
        )}
      </div>

      {/* Mağaza */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <h2 className="text-lg font-semibold">Mağaza Vitrini</h2>
        {products.length === 0 ? (
          <p className="text-slate-400">
            Henüz ürün yok. Admin panelinden ürün eklediğinde burada görünecek.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="border border-slate-800 rounded-xl p-3 flex flex-col gap-2 bg-slate-900/40"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-48 object-cover rounded-lg mb-2 border border-slate-700"
                  />
                )}
                <div className="text-base font-medium">{p.title}</div>
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

        {/* Admin Panel */}
        <div className="mt-10 border border-slate-800 rounded-xl p-4 bg-slate-900/60">
          <h2 className="text-lg font-semibold mb-3">Admin Panel</h2>

          {!token ? (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <button
                onClick={handleLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded"
              >
                Admin Giriş
              </button>
            </>
          ) : (
            <>
              <p className="text-emerald-400 mb-2">Admin girişi aktif ✅</p>
              <button
                onClick={handleLogout}
                className="w-full bg-rose-600 hover:bg-rose-700 py-2 rounded mb-4"
              >
                Çıkış
              </button>

              <input
                value={newProduct.title}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, title: e.target.value })
                }
                placeholder="Ürün adı"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Açıklama"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <input
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="Fiyat"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <input
                value={newProduct.image_url}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image_url: e.target.value })
                }
                placeholder="(isteğe bağlı) Görsel URL"
                className="w-full mb-2 p-2 rounded bg-slate-800 border border-slate-700"
              />
              <button
                onClick={handleAddProduct}
                className="w-full bg-slate-100 text-black font-semibold py-2 rounded"
              >
                Ürün Ekle
              </button>
            </>
          )}

          {msg && <p className="text-sm text-center mt-3 text-slate-300">{msg}</p>}
        </div>
      </div>

      <footer className="text-center text-slate-600 text-xs mt-10">
        A'LIXE · Internal alpha build · Powered by FastAPI & React
      </footer>
    </div>
  );
}

export default App;