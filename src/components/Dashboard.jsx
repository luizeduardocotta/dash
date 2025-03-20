import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; 
  });

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
          sparkline: true,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Erro ao buscar dados", error));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark"); // Adiciona a classe "dark" no <html>
    } else {
      document.documentElement.classList.remove("dark"); // Remove a classe "dark" do <html>
    }
    localStorage.setItem("darkMode", darkMode); // Salva a preferência do usuário
  }, [darkMode]);

  return (
    <div className="min-h-screen p-5 transition-all duration-300 bg-white text-black dark:bg-gray-900 dark:text-white">
      <button
        className="mb-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => setDarkMode((prevMode) => !prevMode)}
      >
        {darkMode ? "Modo Claro" : "Modo Escuro"}
      </button>

      <h1 className="text-2xl font-bold mb-4">Dashboard de Criptomoedas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((coin) => (
          <div
            key={coin.id}
            className="p-4 border rounded-lg shadow-lg transition-all duration-300 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
          >
            <h2 className="text-xl font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</h2>
            <p>Preço Atual: ${coin.current_price.toFixed(2)}</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={coin.sparkline_in_7d.price.map((price, index) => ({ index, price }))}>
                <XAxis dataKey="index" hide={true} />
                <YAxis domain={["dataMin", "dataMax"]} hide={true} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
