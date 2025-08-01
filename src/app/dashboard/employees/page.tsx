"use client";

import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(id ? `/api/employees/${id}` : "/api/employees", {
      method: id ? "PUT" : "POST",
      body: formData,
    });
    if (res.ok) {
      alert(id ? "Employee updated!" : "Employee added!");
      setEditingEmployee(null);
      fetchEmployees();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    fetchEmployees();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={(e) => handleSubmit(e, editingEmployee?.id)}
        className="grid grid-cols-3 gap-4 border p-4 mb-6"
      >
        <input name="employeeCode" defaultValue={editingEmployee?.employeeCode} placeholder="Employee Code" className="border p-2" required />
        <input name="name" defaultValue={editingEmployee?.name} placeholder="Name" className="border p-2" required />
        <input name="doj" type="date" defaultValue={editingEmployee?.doj?.split("T")[0]} className="border p-2" required />
        <input name="department" defaultValue={editingEmployee?.department} placeholder="Department" className="border p-2" />
        <input name="designation" defaultValue={editingEmployee?.designation} placeholder="Designation" className="border p-2" />
        <input name="contactNo" defaultValue={editingEmployee?.contactNo} placeholder="Contact No" className="border p-2" />
        <input name="email" defaultValue={editingEmployee?.email} placeholder="Email" className="border p-2" />
        <input name="reportingTo" defaultValue={editingEmployee?.reportingTo} placeholder="Reporting To" className="border p-2" />
        <select name="status" defaultValue={editingEmployee?.status || "Active"} className="border p-2">
          <option>Active</option>
          <option>Inactive</option>
          <option>Serving Notice</option>
        </select>
        <input name="location" defaultValue={editingEmployee?.location} placeholder="Location" className="border p-2" />
        <input name="nationality" defaultValue={editingEmployee?.nationality} placeholder="Nationality" className="border p-2" />
        <input name="grade" defaultValue={editingEmployee?.grade} placeholder="Grade" className="border p-2" />
        <input name="personalEmail" defaultValue={editingEmployee?.personalEmail} placeholder="Personal Email" className="border p-2" />
        <input name="pan" defaultValue={editingEmployee?.pan} placeholder="PAN" className="border p-2" />
        <input name="aadhar" defaultValue={editingEmployee?.aadhar} placeholder="Aadhar" className="border p-2" />
        <input name="address" defaultValue={editingEmployee?.address} placeholder="Address" className="border p-2" />
        <input name="altContactNo" defaultValue={editingEmployee?.altContactNo} placeholder="Alt Contact No" className="border p-2" />
        <input name="uan" defaultValue={editingEmployee?.uan} placeholder="UAN" className="border p-2" />
        <input name="fatherName" defaultValue={editingEmployee?.fatherName} placeholder="Father Name" className="border p-2" />
        <input name="highestEducation" defaultValue={editingEmployee?.highestEducation} placeholder="Highest Education" className="border p-2" />
        <input name="modeOfSeparation" defaultValue={editingEmployee?.modeOfSeparation} placeholder="Mode of Separation" className="border p-2" />
        <input name="lwd" type="date" defaultValue={editingEmployee?.lwd?.split("T")[0]} className="border p-2" />
        <input type="hidden" name="companyId" value="COMPANY_ID_HERE" />
        <button className="bg-green-500 text-white p-2 col-span-3">
          {editingEmployee ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee List */}
      <ul>
        {employees.map((emp) => (
          <li key={emp.id} className="border p-3 mb-2">
            <div className="flex justify-between">
              <div>
                <strong>{emp.employeeCode}</strong> - {emp.name} ({emp.designation}) - {emp.status}
              </div>
              <div>
                <button onClick={() => setEditingEmployee(emp)} className="mr-2 text-blue-500">Edit</button>
                <button onClick={() => handleDelete(emp.id)} className="text-red-500">Delete</button>
                <button onClick={() => setExpanded(expanded === emp.id ? null : emp.id)} className="ml-2 text-gray-600">
                  {expanded === emp.id ? "Hide" : "Details"}
                </button>
              </div>
            </div>

            {expanded === emp.id && (
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded">
                <p><strong>DOJ:</strong> {emp.doj?.split("T")[0]}</p>
                <p><strong>Department:</strong> {emp.department}</p>
                <p><strong>Location:</strong> {emp.location}</p>
                <p><strong>Nationality:</strong> {emp.nationality}</p>
                <p><strong>Grade:</strong> {emp.grade}</p>
                <p><strong>Personal Email:</strong> {emp.personalEmail}</p>
                <p><strong>PAN:</strong> {emp.pan}</p>
                <p><strong>Aadhar:</strong> {emp.aadhar}</p>
                <p><strong>Address:</strong> {emp.address}</p>
                <p><strong>Alt Contact:</strong> {emp.altContactNo}</p>
                <p><strong>UAN:</strong> {emp.uan}</p>
                <p><strong>Father Name:</strong> {emp.fatherName}</p>
                <p><strong>Education:</strong> {emp.highestEducation}</p>
                {emp.status !== "Active" && (
                  <>
                    <p><strong>Mode of Separation:</strong> {emp.modeOfSeparation}</p>
                    <p><strong>LWD:</strong> {emp.lwd?.split("T")[0]}</p>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
