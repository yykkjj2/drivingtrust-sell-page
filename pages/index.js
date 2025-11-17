import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [brand, setBrand] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/getCars");
        const data = await res.json();
        const approved = (data || []).filter(
          (c) => (c.status || "pending").toLowerCase() === "approved"
        );
        setCars(approved);
        setFiltered(approved);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let list = [...cars];

    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      list = list.filter((c) =>
        `${c.car || ""} ${c.city || ""} ${c.name || ""} ${c.phone || ""}`
          .toLowerCase()
          .includes(kw)
      );
    }

    if (city !== "all") {
      list = list.filter((c) => c.city === city);
    }

    if (brand !== "all") {
      list = list.filter((c) =>
        (c.car || "").toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (maxPrice !== "all") {
      list = list.filter((c) => Number(c.price || 0) <= Number(maxPrice));
    }

    setFiltered(list);
  }, [keyword, city, maxPrice, brand, cars]);

  const cities = Array.from(new Set(cars.map((c) => c.city).filter(Boolean)));

  const brands = [
    "Toyota",
    "Lexus",
    "Honda",
    "Acura",
    "Nissan",
    "Infiniti",
    "Subaru",
    "Mazda",
    "Mitsubishi",
    "Hyundai",
    "Kia",
    "Genesis",
    "Ford",
    "Lincoln",
    "Chevrolet",
    "GMC",
    "Cadillac",
    "Buick",
    "Chrysler",
    "Dodge",
    "RAM",
    "Jeep",
    "Tesla",
    "Mercedes-Benz",
    "BMW",
    "MINI",
    "Audi",
    "Porsche",
    "Volkswagen",
    "Land Rover",
    "Range Rover",
    "Jaguar",
    "Bentley",
    "Rolls-Royce",
    "Lotus",
    "McLaren",
    "Aston Martin",
    "Ferrari",
    "Lamborghini",
    "Maserati",
    "Alfa Romeo",
    "Fiat",
    "Volvo",
    "Polestar",
    "Koenigsegg",
    "Lucid",
    "Rivian"
  ];

  return (
    <div className="layout">
      <div className="top-bar">
        <div className="brand">
          <div className="brand-logo">DT</div>
          <div>
            <div className="brand-title">DrivingTrust</div>
            <div className="brand-sub">Safer C2C auto deals in BC</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/sell">
            <button className="btn btn-primary">Sell my car / 我要卖车</button>
          </Link>
          <Link href="/admin">
            <button className="btn btn-outline">Admin</button>
          </Link>
        </div>
      </div>

      {/* 快速搜索条 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
          QUICK SEARCH · 快速筛选车源
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center"
          }}
        >
          <input
            className="input"
            style={{ flex: 1, minWidth: 160 }}
            placeholder="Keyword / 关键词（品牌 / 车型 / 城市 / 电话）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="select"
            style={{ width: 130 }}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className="select"
            style={{ width: 120 }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="select"
            style={{ width: 130 }}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          >
            <option value="all">Max Price</option>
            <option value="15000">≤ $15,000</option>
            <option value="25000">≤ $25,000</option>
            <option value="35000">≤ $35,000</option>
            <option value="50000">≤ $50,000</option>
            <option value="80000">≤ $80,000</option>
          </select>
        </div>
      </div>

      {/* 列表 */}
      <div className="card">
        <div
          style={{
            marginBottom: 10,
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span>
            Car Listings · 车源列表{" "}
            {loading ? "(Loading...)" : `(${filtered.length} cars)`}
          </span>
        </div>

        {loading ? (
          <div style={{ fontSize: 13, color: "#6b7280" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            No matching cars. 没有符合条件的车。
          </div>
        ) : (
          <div className="grid">
            {filtered.map((car) => {
              const img =
                car.images && car.images.length > 0
                  ? car.images[0]
                  : "https://placehold.co/600x400?text=DrivingTrust";
              return (
                <Link key={car.id} href={`/car/${car.id}`}>
                  <div className="car-card">
                    <img src={img} alt={car.car} />
                    <div className="car-card-body">
                      <div className="car-title">{car.car}</div>
                      <div className="car-meta">
                        {car.city || "—"} ·{" "}
                        {car.mileage
                          ? `${Number(car.mileage).toLocaleString()} km`
                          : "Mileage N/A"}
                      </div>
                      <div className="car-meta">
                        Seller: {car.name || "—"} · {car.phone || ""}
                      </div>
                      <div className="car-price">
                        {car.price ? `$${car.price}` : "Contact for price"}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
