import { useState, useEffect } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterModel, setFilterModel] = useState("all");

  useEffect(() => {
    const savedHistory = localStorage.getItem("analysisHistory");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "detected" && item.detected) ||
      (filterStatus === "not-detected" && !item.detected);

    const matchesModel =
      filterModel === "all" ||
      item.model === filterModel;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesModel
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] py-12"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="mb-2"
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            Analysis History
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#64748B",
            }}
          >
            View all your previous image analysis results
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "#64748B" }}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search by file name..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border outline-none"
                  style={{
                    borderColor: "#E2E8F0",
                    backgroundColor: "#F8FAFC",
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  borderColor: "#E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <option value="all">All Status</option>
                <option value="detected">Detected</option>
                <option value="not-detected">
                  Not Detected
                </option>
              </select>
            </div>

            {/* Model */}
            <div>
              <select
                value={filterModel}
                onChange={(e) =>
                  setFilterModel(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  borderColor: "#E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <option value="all">All Models</option>
                <option value="CNN">CNN</option>
                <option value="SVM">SVM</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">

            <div className="flex justify-center mb-4">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full"
                style={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Filter
                  className="w-8 h-8"
                  style={{ color: "#64748B" }}
                />
              </div>
            </div>

            <h3
              className="mb-2"
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1E293B",
              }}
            >
              {history.length === 0
                ? "No Analysis History"
                : "No Results Found"}
            </h3>

            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              {history.length === 0
                ? "Start analyzing images to see your history here"
                : "Try adjusting your filters or search query"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <table className="w-full">
              <thead
                style={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                <tr>
                  <th className="px-6 py-4 text-left">
                    DATE
                  </th>
                  <th className="px-6 py-4 text-left">
                    IMAGE
                  </th>
                  <th className="px-6 py-4 text-left">
                    MODEL
                  </th>
                  <th className="px-6 py-4 text-left">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left">
                    CONFIDENCE
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t"
                  >
                    <td className="px-6 py-4">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {item.fileName}
                    </td>

                    <td className="px-6 py-4">
                      {item.model}
                    </td>

                    <td className="px-6 py-4">
                      {item.detected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Detected
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          Not Detected
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {item.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredHistory.length > 0 && (
          <div className="mt-6">
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              Showing {filteredHistory.length} of{" "}
              {history.length} results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}