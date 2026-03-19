import React, { useEffect, useState } from "react";
import HikeForm from "../components/HikeForm";
import HikeList from "../components/HikeList";

function AdminPage({ backendUser }) {
  const [users, setUsers] = useState([]);
  const [hikes, setHikes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingHikes, setLoadingHikes] = useState(true);
  const [error, setError] = useState("");

  // --- Fetch all users ---
  useEffect(() => {
    if (!backendUser || backendUser.role !== "admin") {
      setLoadingUsers(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${backendUser.sub ?? ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoadingUsers(false);
      });
  }, [backendUser]);

  // --- Fetch all hikes ---
  const fetchHikes = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hikes`)
      .then((res) => res.json())
      .then((data) => setHikes(data))
      .catch((err) => console.error("Error fetching hikes:", err))
      .finally(() => setLoadingHikes(false));
  };

  useEffect(() => {
    fetchHikes();
  }, []);

  // --- Handle new hike added ---
  const handleHikeAdded = (newHike) => {
    setHikes((prev) => [...prev, newHike]);
  };

  if (!backendUser) return <div>Please log in to view this page.</div>;
  if (backendUser.role !== "admin") return <div>Access Denied. Admins only.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <section style={{ marginBottom: "30px" }}>
        <h2>All Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "5px" }}>ID</th>
                <th style={{ border: "1px solid black", padding: "5px" }}>Email</th>
                <th style={{ border: "1px solid black", padding: "5px" }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ border: "1px solid black", padding: "5px" }}>{user.id}</td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>{user.email}</td>
                  <td style={{ border: "1px solid black", padding: "5px" }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Hikes Section */}
      <section>
        <h2>Hikes Management</h2>
        <HikeForm onHikeAdded={handleHikeAdded} />
        {loadingHikes ? <p>Loading hikes...</p> : <HikeList hikes={hikes} />}
      </section>
    </div>
  );
}

export default AdminPage;