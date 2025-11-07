import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState("Kontrol ediliyor...");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/health");
        const data = await res.json();
        setHealth(`OK ${JSON.stringify(data)}`);
      } catch (err) {
        setHealth(`Hata: ${err}`);
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <h1>A’LIXE Önyüz</h1>
      <p>Vite + React + Tailwind çalışıyor.</p>
      <p>API bağlantı testi (/health)</p>
      <pre>{health}</pre>
    </div>
  );
}