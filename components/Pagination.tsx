type Props = {
  page: number;
  totalPages: number;
  limit: number;
  onChange: (p: number) => void;
  onLimitChange: (l: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  limit,
  onChange,
  onLimitChange,
}: Props) {
  const generatePages = () => {
    const pages: number[] = [];

    const maxVisible = 5; // 🔥 แสดง 5 หน้า

    let start = Math.max(1, page - 2);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* 🔥 limit */}

      {/* 🔥 pagination */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* หน้าแรก */}
        <button
          disabled={page === 1}
          onClick={() => onChange(1)}
          className={`
      px-2 py-1.5 rounded-md text-sm font-medium border transition
      ${
        page === 1
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
      }
    `}
        >
          {"<<"}
        </button>

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className={`
      px-2 py-1.5 rounded-md text-sm font-medium border transition
      ${
        page === 1
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
      }
    `}
        >
          {"<"}
        </button>

        {/* Numbers */}
        {generatePages().map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`
        px-3 py-1.5 rounded-md text-sm font-semibold border transition
        ${
          page === p
            ? "bg-blue-600 text-white border-blue-600 shadow"
            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
        }
      `}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className={`
      px-2 py-1.5 rounded-md text-sm font-medium border transition
      ${
        page === totalPages
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
      }
    `}
        >
          {">"}
        </button>

        {/* หน้าสุดท้าย */}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(totalPages)}
          className={`
      px-2 py-1.5 rounded-md text-sm font-medium border transition
      ${
        page === totalPages
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-200"
      }
    `}
        >
          {">>"}
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="font-medium">Rows:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="
            border border-gray-300 bg-white
            rounded-md px-2 py-1 text-sm
            focus:ring-2 focus:ring-blue-400
          "
        >
          {[25, 50, 75, 100].map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
