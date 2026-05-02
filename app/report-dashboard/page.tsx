"use client";

import { useEffect, useState } from "react";
import Axios from "../../lib/axios";
import Link from "next/dist/client/link";

type Row = {
  date: string;
  total_bill: number;
  no_sign: number;
  no_image: number;
};

const toNum = (v: number | string) => Number(v) || 0;

export default function Dashboard() {
  const [status18, setStatus18] = useState<Row[]>([]);
  const [createDate, setCreateDate] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 ย้ายเข้า useEffect เลย = ไม่ต้อง dependency
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [res1, res2] = await Promise.all([
          Axios.get<Row[]>("/dashboard/status18"),
          Axios.get<Row[]>("/dashboard/create-date"),
        ]);

        setStatus18(res1.data || []);
        setCreateDate(res2.data || []);
      } catch (err) {
        console.error("DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // 🔥 แก้เฉพาะ UI (logic เดิม 100%)

  const renderStatus18 = () => {
    const total = status18.reduce((s, r) => s + toNum(r.total_bill), 0);
    const noSign = status18.reduce((s, r) => s + toNum(r.no_sign), 0);
    const noImage = status18.reduce((s, r) => s + toNum(r.no_image), 0);

    return (
      <div className="bg-white rounded-2xl border shadow-md overflow-hidden flex flex-col h-full">
        {/* HEADER */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="text-sm font-semibold text-gray-800">Status 18</div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-3 p-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-gray-400">Total</div>
            <div className="text-lg font-bold text-gray-800">
              {total.toLocaleString()}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-red-400">No Sign</div>
            <div className="text-lg font-bold text-red-600">
              {noSign.toLocaleString()}
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-orange-400">No Image</div>
            <div className="text-lg font-bold text-orange-600">
              {noImage.toLocaleString()}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">No Sign</th>
                <th className="px-3 py-2 text-right">No Image</th>
              </tr>
            </thead>

            <tbody>
              {status18.map((r, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-blue-50 even:bg-gray-50/40 transition"
                >
                  <td className="px-3 py-2 text-gray-700 font-mono">
                    {r.date
                      ? new Date(r.date).toLocaleDateString("en-CA")
                      : "-"}
                  </td>

                  <td className="px-3 py-2 text-right font-semibold text-gray-800">
                    {toNum(r.total_bill).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <span className="text-red-600 font-medium">
                      {toNum(r.no_sign).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-right">
                    <span className="text-orange-600 font-medium">
                      {toNum(r.no_image).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCreate = () => {
    const total = createDate.reduce((s, r) => s + toNum(r.total_bill), 0);
    const noSign = createDate.reduce((s, r) => s + toNum(r.no_sign), 0);
    const noImage = createDate.reduce((s, r) => s + toNum(r.no_image), 0);

    return (
      <div className="bg-white rounded-2xl border shadow-md overflow-hidden flex flex-col h-full">
        {/* HEADER */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="text-sm font-semibold text-gray-800">Create Date</div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-3 p-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-gray-400">Total</div>
            <div className="text-lg font-bold text-gray-800">
              {total.toLocaleString()}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-red-400">No Sign</div>
            <div className="text-lg font-bold text-red-600">
              {noSign.toLocaleString()}
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-[10px] text-orange-400">No Image</div>
            <div className="text-lg font-bold text-orange-600">
              {noImage.toLocaleString()}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right">No Sign</th>
                <th className="px-3 py-2 text-right">No Image</th>
              </tr>
            </thead>

            <tbody>
              {createDate.map((r, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-blue-50 even:bg-gray-50/40 transition"
                >
                  <td className="px-3 py-2 text-gray-700 font-mono">
                    {r.date
                      ? new Date(r.date).toLocaleDateString("en-CA")
                      : "-"}
                  </td>

                  <td className="px-3 py-2 text-right font-semibold text-gray-800">
                    {toNum(r.total_bill).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <span className="text-red-600 font-medium">
                      {toNum(r.no_sign).toLocaleString()}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-right">
                    <span className="text-orange-600 font-medium">
                      {toNum(r.no_image).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      {/* 🔥 TOP MENU */}
      <div className="max-w-[1600px] mx-auto mb-3 flex justify-end">
        <Link
          href="/report-backup"
          className="
      inline-flex items-center gap-2
      px-4 py-2 text-sm font-medium
      text-gray-700 bg-white
      border border-gray-200
      rounded-lg shadow-sm
      hover:bg-gray-50 hover:border-gray-300
      active:scale-[0.98]
      transition
    "
        >
          📁 Backup Images
        </Link>
      </div>

      {/* 🔥 CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="col-span-2 text-center py-10 text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            {renderStatus18()}
            {renderCreate()}
          </>
        )}
      </div>
    </div>
  );
}
