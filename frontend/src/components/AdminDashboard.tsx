import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ---------------- TYPES ---------------- */

type TabType = "dashboard" | "issues";

interface Reporter {
  name: string;
  email: string;
  reportedDate: string;
}

interface IssueData {
  id: string;
  category: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  imageUrl?: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  urgencyScore: number;
  status: "Pending" | "In Progress" | "Resolved";
  reportedDate: string;
  reporters: Reporter[];
  aiAnalysis?: string;
}

/* ---------------- HELPERS ---------------- */

const mapStatus = (status: string) => {
  if (status === "resolved") return "Resolved";
  if (status === "in_progress") return "In Progress";
  return "Pending";
};

/* ---------------- COMPONENT ---------------- */

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
  const [issues, setIssues] = useState<IssueData[]>([]);

  /* ---------- FIRESTORE ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IssueData[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const votes = d.votes || 1;

        return {
          id: docSnap.id,
          category: d.issueType || "Unknown",
          latitude: d.latitude,
          longitude: d.longitude,
          address: d.address || "No address",
          imageUrl: d.imageUrl || "",

          urgency: d.urgency || "Low",
          urgencyScore: d.urgencyScore || 40,

          status: mapStatus(d.status || "open"),

          reportedDate:
            d.createdAt?.toDate?.().toDateString?.() || "N/A",

          reporters: Array(votes).fill({
            name: "Citizen",
            email: "",
            reportedDate: "",
          }),

          aiAnalysis: d.aiAnalysis || "",
        };
      });

      setIssues(data);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- STATUS UPDATE ---------- */
  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "issues", id), {
      status: status,
      updatedAt: new Date(),
    });

    setSelectedIssue(null);
  };

  /* ---------- STATS ---------- */
  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Pending").length,
    inProgress: issues.filter((i) => i.status === "In Progress").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  /* ---------- DASHBOARD ---------- */
  const renderDashboard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded shadow">Total: {stats.total}</div>
      <div className="bg-white p-6 rounded shadow">Pending: {stats.pending}</div>
      <div className="bg-white p-6 rounded shadow">In Progress: {stats.inProgress}</div>
      <div className="bg-white p-6 rounded shadow">Resolved: {stats.resolved}</div>
    </div>
  );

  /* ---------- ISSUES TABLE ---------- */
  const renderIssues = () => (
    <div className="bg-white rounded shadow p-4">
      {issues.length === 0 ? (
        <p className="text-gray-500 text-center py-5">
          No issues found
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Issue</th>
              <th className="p-3">Urgency</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reports</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{issue.category}</td>
                <td className="p-3">{issue.urgency}</td>
                <td className="p-3">{issue.status}</td>
                <td className="p-3">{issue.reporters.length}</td>

                <td className="p-3">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  /* ---------- MAIN ---------- */
  return (
    <div className="p-6">

      {/* NAV */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded ${
            activeTab === "dashboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("issues")}
          className={`px-4 py-2 rounded ${
            activeTab === "issues"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Issues
        </button>
      </div>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "issues" && renderIssues()}

      {/* ---------- MODAL ---------- */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[500px] space-y-4">

            {/* IMAGE */}
            {selectedIssue.imageUrl && (
              <img
                src={selectedIssue.imageUrl}
                className="w-full h-48 object-cover rounded"
              />
            )}

            <h2 className="font-semibold text-lg">
              {selectedIssue.category}
            </h2>

            <p className="text-sm text-gray-600">
              {selectedIssue.aiAnalysis || "No AI analysis"}
            </p>

            {/* ADDRESS */}
            <p className="text-sm">
              📍 {selectedIssue.address}
            </p>

            {/* MAP LINK */}
            {selectedIssue.latitude && selectedIssue.longitude && (
              <a
                href={`https://www.google.com/maps?q=${selectedIssue.latitude},${selectedIssue.longitude}`}
                target="_blank"
                className="text-blue-600 text-sm underline"
              >
                View on Map
              </a>
            )}

            {/* STATUS */}
            <p className="text-sm">
              Current Status: <strong>{selectedIssue.status}</strong>
            </p>

            <select
              className="w-full border p-2"
              defaultValue={
                selectedIssue.status === "Resolved"
                  ? "resolved"
                  : selectedIssue.status === "In Progress"
                  ? "in_progress"
                  : "open"
              }
              onChange={(e) =>
                updateStatus(selectedIssue.id, e.target.value)
              }
            >
              <option value="open">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* BUTTONS */}
            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full bg-gray-200 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}