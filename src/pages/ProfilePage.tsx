import React from "react";

function ProfilePage({ backendUser }) {
  if (!backendUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile Page</h1>

      <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <p>
          <strong>Email:</strong> {backendUser.email || "N/A"}
        </p>
        <p>
          <strong>User ID:</strong> {backendUser.sub || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {backendUser.role || "N/A"}
        </p>
        <p>
          <strong>Authenticated:</strong> {backendUser.authenticated ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;