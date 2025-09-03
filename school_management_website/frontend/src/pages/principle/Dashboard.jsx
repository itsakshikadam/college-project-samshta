import React from "react";
import Navbar from "../../components/Navbar";

export default function PrincipalDashboard() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Principal Dashboard</h1>
        <p>Welcome! You are logged in as principal.</p>
        {/* Add more principal features/pages here */}
      </div>
    </>
  );
}
