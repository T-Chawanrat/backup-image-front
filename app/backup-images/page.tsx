"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useCallback } from "react";
import Axios from "../../lib/axios";
import Pagination from "../../components/Pagination";

type Row = {
  create_date: string;
  warehouse_name: string;
  receive_code: string;
  reference_no: string;
  package_name: string;
  date_status18: string;
  sign_name: string;
  document_id: string;
  created_at: string;
};

type ImgWithFallbackProps = {
  base: string;
  onPreview: (src: string) => void;
};

const ImgWithFallback = ({ base, onPreview }: ImgWithFallbackProps) => {
  const [src, setSrc] = useState<string>(`${base}.jpg`);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-red-500 text-[10px] font-semibold">NO IMAGE</span>
    );
  }

  return (
    <img
      src={src}
      width={40}
      height={40}
      className="rounded border cursor-pointer hover:scale-105 transition"
      onClick={() => onPreview(src)}
      onError={() => {
        if (src.endsWith(".jpg")) {
          setSrc(`${base}.png`);
        } else {
          setFailed(true);
        }
      }}
    />
  );
};

export default function Page() {
  const [data, setData] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [hasSign, setHasSign] = useState("");
  const [hasImage, setHasImage] = useState("");
  const [warehouses, setWarehouses] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedWarehouses, setSelectedWarehouses] = useState<number[]>([]);
  const warehouseId =
    selectedWarehouses.length > 0 ? selectedWarehouses.join(",") : undefined;
  const [createDate, setCreateDate] = useState("");
  const [status18Date, setStatus18Date] = useState("");

  const [preview, setPreview] = useState<{
    src: string;
    type: "image" | "sign";
  } | null>(null);

  const [limit, setLimit] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("limit")) || 100;
    }
    return 100;
  });

  const fetchData = useCallback(
    async (p: number, s: string) => {
      try {
        const res = await Axios.get("/backup-images", {
          params: {
            page: p,
            limit,
            search: s,
            has_sign: hasSign || undefined,
            has_image: hasImage || undefined,

            // ✅ เพิ่ม
            warehouse_id: warehouseId || undefined,
            create_date: createDate || undefined,
            date_status18: status18Date || undefined,
          },
        });

        setData(res.data.data);
        setPage(res.data.pagination.page);
        setTotalPages(res.data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      }
    },
    [limit, hasImage, hasSign, warehouseId, createDate, status18Date],
  );

  const toggleWarehouse = (id: number) => {
    setPage(1);
    setSelectedWarehouses((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      return next;
    });
  };

  const handleExport = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (hasSign) params.append("has_sign", hasSign);
    if (hasImage) params.append("has_image", hasImage);

    // ✅ เพิ่ม
    if (warehouseId) params.append("warehouse_id", warehouseId);
    if (createDate) params.append("create_date", createDate);
    if (status18Date) params.append("date_status18", status18Date);

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${base}/backup-images/export?${params.toString()}`;

    window.open(url, "_blank");
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await Axios.get("/backup-images", {
          params: {
            page,
            limit,
            search,
            has_sign: hasSign || undefined,
            has_image: hasImage || undefined,

            // ✅ เพิ่ม
            warehouse_id: warehouseId || undefined,
            create_date: createDate || undefined,
            date_status18: status18Date || undefined,
          },
        });

        setData(res.data.data);
        setPage(res.data.pagination.page);
        setTotalPages(res.data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [
    page,
    limit,
    search,
    hasSign,
    hasImage,
    warehouseId,
    createDate,
    status18Date,
  ]);

  useEffect(() => {
    localStorage.setItem("limit", limit.toString());
  }, [limit]);

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await Axios.get("/backup-images/warehouses");
        setWarehouses(res.data);
      } catch (err) {
        console.error("load warehouses error:", err);
      }
    };

    loadWarehouses();
  }, []);

  const highlight = (text: string): ReactNode => {
    if (!search) return text;

    const cleanSearch = search.replace(/[-\s]/g, "").toLowerCase();
    const cleanText = text.replace(/[-\s]/g, "").toLowerCase();

    if (!cleanText.includes(cleanSearch)) return text;

    const pattern = cleanSearch.split("").join("[-\\s]*");
    const regex = new RegExp(`(${pattern})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/\s/g, ""))}
            placeholder="Search receive_code / reference_no"
            className="w-72 bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

          <select
            value={hasSign}
            onChange={(e) => {
              setPage(1);
              setHasSign(e.target.value);
            }}
            className="bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="true">มีลายเซ็น</option>
            <option value="false">ไม่มีลายเซ็น</option>
          </select>

          <select
            value={hasImage}
            onChange={(e) => {
              setPage(1);
              setHasImage(e.target.value);
            }}
            className="bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="true">มีรูปภาพ</option>
            <option value="false">ไม่มีรูปภาพ</option>
          </select>

          <input
            type="date"
            value={createDate}
            onChange={(e) => {
              setPage(1);
              setCreateDate(e.target.value);
            }}
            className="bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={status18Date}
            onChange={(e) => {
              setPage(1);
              setStatus18Date(e.target.value);
            }}
            className="bg-white text-gray-800 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

          {/* 🔥 ย้าย warehouse มาอยู่ตรงนี้ */}
          <div className="relative">
            <details className="group">
              <summary className="list-none cursor-pointer bg-white border text-gray-800 border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                Warehouse
                <span className="text-blue-600 text-xs">
                  {selectedWarehouses.length > 0
                    ? `(${selectedWarehouses.length})`
                    : ""}
                </span>
              </summary>

              {/* dropdown */}
              <div className="absolute z-20 mt-2 w-64 bg-white border rounded-lg shadow p-3">
                <div className="flex justify-between mb-2 text-xs">
                  <button
                    className="text-blue-600"
                    onClick={() =>
                      setSelectedWarehouses(warehouses.map((w) => w.id))
                    }
                  >
                    Select All
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => setSelectedWarehouses([])}
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-40 overflow-auto flex flex-col gap-1">
                  {warehouses.map((w) => (
                    <label
                      key={w.id}
                      className="flex items-center gap-2 hover:bg-gray-100 px-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedWarehouses.includes(w.id)}
                        onChange={() => toggleWarehouse(w.id)}
                      />
                      <span>{w.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </details>
          </div>

          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            Export Excel
          </button>
        </div>

        {/* TABLE เดิมทั้งหมด */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="overflow-auto max-h-[85vh]">
            <table className="min-w-[900px] w-full text-xs text-gray-700">
              <thead className="bg-gray-100 text-[11px] uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 text-left">Create</th>
                  <th className="px-3 py-2 text-left">Warehouse</th>
                  <th className="px-3 py-2 text-left">Receive Code</th>
                  <th className="px-3 py-2 text-left">Reference</th>
                  <th className="px-3 py-2 text-left">Package Name</th>
                  <th className="px-3 py-2 text-left">Status 18</th>
                  <th className="px-3 py-2 text-left">Signature</th>
                  <th className="px-3 py-2 text-left">Image</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-blue-100/70">
                    <td className="px-3 py-1.5 font-mono text-gray-600">
                      {r.create_date
                        ? new Date(r.create_date).toLocaleDateString("en-CA")
                        : "-"}
                    </td>

                    <td className="px-3 py-1.5">{r.warehouse_name}</td>

                    <td className="px-3 py-1.5 font-medium">
                      {highlight(r.receive_code)}
                    </td>

                    <td className="px-3 py-1.5">{highlight(r.reference_no)}</td>

                    <td className="px-3 py-1.5">{r.package_name}</td>

                    <td className="px-3 py-1.5">
                      {r.date_status18
                        ? new Date(r.date_status18).toLocaleDateString("en-CA")
                        : "-"}
                    </td>

                    <td>
                      {r.sign_name ? (
                        <ImgWithFallback
                          base={`/sign/${r.sign_name}`}
                          onPreview={(src) => setPreview({ src, type: "sign" })}
                        />
                      ) : (
                        <span className="text-red-500 text-[10px] font-semibold">
                          NO IMAGE
                        </span>
                      )}
                    </td>

                    <td>
                      {r.document_id ? (
                        <ImgWithFallback
                          base={`/image/${r.document_id}`}
                          onPreview={(src) =>
                            setPreview({ src, type: "image" })
                          }
                        />
                      ) : (
                        <span className="text-red-500 text-[10px] font-semibold">
                          NO IMAGE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <Pagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              onChange={(p) => fetchData(p, search)}
              onLimitChange={(l) => setLimit(l)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
