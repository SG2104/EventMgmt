import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type PaginationType = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  totalPages: number;
  className?: string;
};

const Pagination = ({
  page,
  setPage,
  totalPages,
  className,
}: PaginationType) => {
  const [currentRange, setCurrentRange] = useState<number[]>([]);

  useEffect(() => {
    const startPage = Math.floor((page - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    const paginationArray: number[] = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    setCurrentRange(paginationArray);
  }, [page, totalPages]);

  return (
    <>
      {totalPages > 1 && (
        <div
          className={`flex justify-center items-center space-x-4 p-4 rounded-xl border border-blue-300 shadow-lg max-w-none mx-auto mt-10 ${className}`}
        >
          {/* Previous Arrow */}
          <button
            className={`${
              page === 1 && "opacity-50 cursor-not-allowed"
            } text-blue-700 hover:bg-blue-100 transition duration-300 rounded-full w-8 h-8 flex items-center justify-center`}
            aria-label="Previous"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <ChevronLeft />
          </button>

          <ul className="flex items-center space-x-2 text-gray-600 overflow-auto">
            {currentRange.map((item) => (
              <li key={item}>
                <button
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    page === item ? "text-white bg-primary/90" : "text-black"
                  }`}
                  aria-current="page"
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          {/* Next Arrow */}
          <button
            className={`${
              page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            } text-blue-700 hover:bg-blue-100 transition duration-300 rounded-full w-8 h-8 flex items-center justify-center`}
            aria-label="Next"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default Pagination;
