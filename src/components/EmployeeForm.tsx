"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EmployeeForm({
  initialData,
  onSubmit,
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState(
    initialData || {
      employeeCode: "",
      name: "",
      doj: "",
      department: "",
      designation: "",
      contactNo: "",
      email: "",
      reportingTo: "",
      status: "Active",
      grade: "",
      personalEmail: "",
      pan: "",
      aadhar: "",
      address: "",
      altContactNo: "",
      uan: "",
      fatherName: "",
      highestEducation: "",
      modeOfSeparation: "",
      lwd: "",
      profileImage: null,
    }
  );

  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.profileImage || null
  );

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-xl shadow-md"
    >
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center">
        <label htmlFor="profileImage" className="cursor-pointer group relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 border hover:opacity-80 transition"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2 hover:bg-gray-300 transition">
              <span className="text-gray-500 text-sm">Upload</span>
            </div>
          )}
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="employeeCode"
          value={formData.employeeCode}
          onChange={handleChange}
          placeholder="Employee Code"
        />
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <Input
          name="doj"
          value={formData.doj}
          onChange={handleChange}
          placeholder="Date of Joining"
          type="date"
        />
        <Input
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
        />
        <Input
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Designation"
        />
        <Input
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          placeholder="Contact Number"
        />
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Work Email"
        />
        <Input
          name="reportingTo"
          value={formData.reportingTo}
          onChange={handleChange}
          placeholder="Reporting To"
        />
        <Select value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Serving Notice">Serving Notice</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Grade"
        />
        <Input
          name="personalEmail"
          value={formData.personalEmail}
          onChange={handleChange}
          placeholder="Personal Email"
        />
        <Input
          name="pan"
          value={formData.pan}
          onChange={handleChange}
          placeholder="PAN"
        />
        <Input
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
          placeholder="Aadhar"
        />
        <Input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <Input
          name="altContactNo"
          value={formData.altContactNo}
          onChange={handleChange}
          placeholder="Alternate Contact No"
        />
        <Input
          name="uan"
          value={formData.uan}
          onChange={handleChange}
          placeholder="UAN"
        />
        <Input
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="Father's Name"
        />
        <Input
          name="highestEducation"
          value={formData.highestEducation}
          onChange={handleChange}
          placeholder="Highest Education"
        />
      </div>

      {(formData.status === "Inactive" ||
        formData.status === "Serving Notice") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="modeOfSeparation"
            value={formData.modeOfSeparation}
            onChange={handleChange}
            placeholder="Mode of Separation"
          />
          <Input
            name="lwd"
            value={formData.lwd}
            onChange={handleChange}
            placeholder="Last Working Day"
            type="date"
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialData ? "Update Employee" : "Add Employee"}
      </Button>
    </form>
  );
}
