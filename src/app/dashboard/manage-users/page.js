"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FaUserShield, 
  FaStore, 
  FaUser, 
  FaSearch, 
  FaFilter,
  FaCheck,
  FaEllipsisV,
  FaTrash
} from "react-icons/fa";

const mockUsers = [
  {
    _id: "u1",
    name: "System Admin",
    email: "admin@ticketbari.com",
    role: "admin",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    createdAt: "2026-01-15T00:00:00Z"
  },
  {
    _id: "u2",
    name: "Green Line Paribahan",
    email: "vendor@greenline.com",
    role: "vendor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    createdAt: "2026-03-20T00:00:00Z"
  },
  {
    _id: "u3",
    name: "Shohagh Paribahan",
    email: "vendor@shohagh.com",
    role: "vendor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    createdAt: "2026-04-12T00:00:00Z"
  },
  {
    _id: "u4",
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    role: "user",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop",
    createdAt: "2026-07-05T00:00:00Z"
  },
  {
    _id: "u5",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "user",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    createdAt: "2026-08-18T00:00:00Z"
  },
  {
    _id: "u6",
    name: "US-Bangla Travel Ltd",
    email: "agency@usbangla.com",
    role: "vendor",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop",
    createdAt: "2026-09-02T00:00:00Z"
  }
];

export default function ManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      setUsers(res.data);
    } catch {
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole} (Simulated)`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      filterRole === "all" ? true : u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
            background: "rgba(124, 58, 237, 0.15)",
            color: "var(--color-secondary)",
            border: "1px solid rgba(124, 58, 237, 0.3)"
          }}>
            <FaUserShield size={11} /> Admin
          </span>
        );
      case "vendor":
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
            background: "rgba(0, 212, 255, 0.15)",
            color: "var(--color-primary)",
            border: "1px solid rgba(0, 212, 255, 0.3)"
          }}>
            <FaStore size={11} /> Vendor
          </span>
        );
      default:
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "600",
            background: "rgba(16, 185, 129, 0.15)",
            color: "var(--color-success)",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            <FaUser size={11} /> User
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          Manage Platform Users
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          View all registered accounts, change permissions, and assign vendor or administrator access
        </p>
      </div>

      {/* Role filter buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        {["all", "user", "vendor", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
              background: filterRole === r ? "var(--color-primary)" : "var(--surface)",
              color: filterRole === r ? "#050816" : "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              transition: "all 0.2s ease"
            }}
          >
            {r === "all" ? `All Users (${users.length})` : `${r}s (${users.filter((u) => u.role === r).length})`}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaSearch style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search users by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            fontSize: "14px",
            width: "100%",
            outline: "none"
          }}
        />
        {search && (
          <button 
            onClick={() => setSearch("")} 
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "16px" }}>User</th>
                <th style={{ padding: "16px" }}>Email</th>
                <th style={{ padding: "16px" }}>Current Role</th>
                <th style={{ padding: "16px" }}>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    {/* User profile */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0F1629&color=00D4FF`}
                          alt={user.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid var(--border-color)"
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{user.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>ID: {user._id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "16px", color: "var(--text-secondary)" }}>
                      {user.email}
                    </td>

                    {/* Role Badge */}
                    <td style={{ padding: "16px" }}>
                      {getRoleBadge(user.role)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={updatingUserId === user._id}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: "var(--surface-2)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            fontSize: "13px",
                            cursor: "pointer",
                            outline: "none"
                          }}
                        >
                          <option value="user">User</option>
                          <option value="vendor">Vendor</option>
                          <option value="admin">Admin</option>
                        </select>

                        {updatingUserId === user._id && (
                          <span style={{ fontSize: "12px", color: "var(--color-primary)" }}>Updating...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
