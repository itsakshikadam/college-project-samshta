import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF",
  "#fb636b", "#ffe890", "#9e8cd8", "#47adb6", "#f0757b"
];

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: "bi-house" },
  { key: "charts", label: "Charts", icon: "bi-pie-chart" },
  { key: "tables", label: "Tables", icon: "bi-table" },
  { key: "budgets", label: "Budgets", icon: "bi-bar-chart" }
];

// Helper to make labels nicer
const toTitleCase = (str) =>
  str.replace(/_/g, " ").replace(/\w\S*/g, txt =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [unitColumns, setUnitColumns] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sidebarTab, setSidebarTab] = useState("dashboard");
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [tableVisibleColumns, setTableVisibleColumns] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/units")
      .then(res => {
        setUnits(res.data);
        if (res.data.length > 0) {
          const dynamicCols = Object.keys(res.data[0]).map(field => ({
            field,
            label: toTitleCase(field)
          }));
          setUnitColumns(dynamicCols);
          setVisibleColumns(dynamicCols.map(c => c.field));
          setTableVisibleColumns(dynamicCols.map(c => c.field));
        }
      })
      .catch(() => {
        setUnits([]);
        setUnitColumns([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedUnit) return;
    axios.get(`http://localhost:5000/api/admin/budgets/${selectedUnit.unit_id}`)
      .then(res => setBudgets(res.data))
      .catch(() => setBudgets([]));
    axios.get(`http://localhost:5000/api/admin/payments/${selectedUnit.unit_id}`)
      .then(res => setPayments(res.data))
      .catch(() => setPayments([]));
  }, [selectedUnit]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleColumnToggle = (field) => {
    setVisibleColumns(prev =>
      prev.includes(field) ? prev.filter(c => c !== field) : [...prev, field]
    );
  };

  const handleTableColumnToggle = (field) => {
    setTableVisibleColumns(prev =>
      prev.includes(field) ? prev.filter(c => c !== field) : [...prev, field]
    );
  };

  const ColumnSelector = ({ columns, visibleCols, toggleFunc }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="mb-3 position-relative">
        <button
          className="btn btn-outline-primary"
          onClick={() => setOpen(!open)}
        >
          Select Columns ▾
        </button>
        {open && (
          <ul
            className="border rounded bg-white p-2 shadow-sm"
            style={{
              position: "absolute",
              zIndex: 1000,
              maxHeight: 300,
              overflowY: "auto",
              listStyle: "none",
              width: "220px"
            }}
          >
            {columns.map(col => (
              <li key={col.field} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`col-${col.field}`}
                  checked={visibleCols.includes(col.field)}
                  onChange={() => toggleFunc(col.field)}
                />
                <label className="form-check-label small" htmlFor={`col-${col.field}`}>
                  {col.label}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderSchoolTiles = () => (
    <div className="row g-3 mb-4">
      {units.map(u => (
        <div className="col-12 col-sm-6 col-lg-3" key={u.unit_id}>
          <div
            className={`card shadow-sm border-0 h-100 ${selectedUnit?.unit_id === u.unit_id ? "bg-primary text-light" : ""}`}
            onClick={() => {
              setSelectedUnit(u);
              setSidebarTab("dashboard");
            }}
            style={{ cursor: "pointer", transition: ".2s", minHeight: 105 }}
          >
            <div className="card-body">
              <div className="fw-bold fs-5">School {u.unit_id}</div>
              <div className="text-secondary small">SEMIS: {u.semis_no}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUnitDetails = () => (
    <div className="card mb-4">
      <div className="card-header bg-info text-light fw-semibold">
        School Information: {selectedUnit?.semis_no}
      </div>
      <div className="card-body">
        <ColumnSelector
          columns={unitColumns}
          visibleCols={visibleColumns}
          toggleFunc={handleColumnToggle}
        />
        <div className="row g-2">
          {unitColumns.filter(col => visibleColumns.includes(col.field))
            .map(col => (
              <div className="col-6 col-md-4" key={col.field}>
                <strong>{col.label}:</strong>{" "}
                {selectedUnit[col.field] || <span className="text-secondary">--</span>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderPieChart = () => (
    <div className="card mb-4">
      <div className="card-header bg-warning text-dark fw-semibold">
        Budgets: Income by Fiscal Year
      </div>
      <div className="card-body">
        {budgets.length === 0 ? (
          <div className="alert alert-warning">No budget data found.</div>
        ) : (
          <div style={{ height: 360 }}>
            <ResponsiveContainer width="100%" height="95%">
              <PieChart>
                <Pie
                  data={budgets}
                  dataKey="income"
                  nameKey="fiscal_year"
                  cx="50%"
                  cy="50%"
                  outerRadius={115}
                  label={({ name }) => name}
                >
                  {budgets.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={val => val.toLocaleString()} />
                <Legend verticalAlign="bottom" height={40} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );

  const renderBarChart = () => (
    <div className="card mb-4">
      <div className="card-header bg-success text-light fw-semibold">
        Payments (Bar Graph)
      </div>
      <div className="card-body">
        {payments.length === 0 ? (
          <div className="alert alert-warning">No payments data found.</div>
        ) : (
          <div style={{ height: 370 }}>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={payments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={val => val.toLocaleString()} />
                <Legend verticalAlign="top" />
                <Bar dataKey="amount" fill="#1976d2" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );

  const renderTablesView = () => (
    <div className="card">
      <div className="card-header bg-secondary text-light">Unit Table</div>
      <div className="card-body p-0">
        <div className="p-3">
          <ColumnSelector
            columns={unitColumns}
            visibleCols={tableVisibleColumns}
            toggleFunc={handleTableColumnToggle}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                {unitColumns.filter(col => tableVisibleColumns.includes(col.field))
                  .map(col => (
                    <th key={col.field}>{col.label}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {units.map(u => (
                <tr key={u.unit_id}>
                  {unitColumns.filter(col => tableVisibleColumns.includes(col.field))
                    .map(col => (
                      <td key={col.field}>{u[col.field]}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f7fafd" }}>
      {/* Sidebar */}
      <div
        style={{
          minWidth: 220,
          background: "#212b36",
          color: "#fff",
          paddingTop: 24,
          borderRight: "1px solid #e3e7ed"
        }}
        className="flex-shrink-0 d-flex flex-column"
      >
        <div className="ps-4 pb-3 fs-4 fw-bold">
          <i className="bi bi-grid-3x3-gap me-2"></i>Admin Panel
        </div>
        <div className="nav flex-column">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              className={`btn btn-link px-4 py-3 text-start w-100 text-${sidebarTab === item.key ? "info" : "light"} fs-6 fw-semibold`}
              style={{
                ...(sidebarTab === item.key && {
                  background: "#2a3b4d",
                  borderLeft: "4px solid #0dcaf0"
                }),
                border: "none",
                borderRadius: 0
              }}
              onClick={() => setSidebarTab(item.key)}
            >
              <i className={`bi me-2 ${item.icon}`}></i>{item.label}
            </button>
          ))}
          <button
            className="btn btn-link px-4 py-3 text-start w-100 text-danger fs-6 fw-semibold mt-3"
            style={{ border: "none", borderRadius: 0 }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
        <div className="mt-auto ps-4 pb-4 text-muted small">
          © {new Date().getFullYear()} School Admin
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-fill" style={{ padding: "2.5rem 2rem" }}>
        <h3 className="fw-bold mb-3">School Overview</h3>
        <div className="row mb-4">
          <div className="col-auto">
            <div className="card border-0 shadow-sm text-center" style={{ minWidth: 130 }}>
              <div className="card-body p-3">
                <span className="fs-2 fw-bold text-primary">{units.length}</span>
                <div className="small text-secondary">Total Schools</div>
              </div>
            </div>
          </div>
        </div>
        {renderSchoolTiles()}
        {sidebarTab === "tables" ? (
          renderTablesView()
        ) : selectedUnit ? (
          <>
            {sidebarTab === "dashboard" && renderUnitDetails()}
            {sidebarTab === "charts" && renderPieChart()}
            {sidebarTab === "budgets" && renderBarChart()}
          </>
        ) : (
          <div className="alert alert-secondary mt-4">
            Click a school above to view information and charts.
          </div>
        )}
      </main>
    </div>
  );
}
