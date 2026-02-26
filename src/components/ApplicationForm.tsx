import React, { useState } from "react";

export default function ApplicationForm({
  schemeId,
  schemeName,
  onClose,
}: {
  schemeId: number;
  schemeName: string;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",

    relationType: "", // Father / Mother / Spouse
    relationName: "",

    gender: "",
    category: "",
    state: "",
    aadhaar: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⭐ relation validation
    if (!formData.relationType || !formData.relationName) {
      alert("Please fill relation details");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
  userId: formData.phone,
  schemeId,
  ...formData,
})
        // body: JSON.stringify({
        //   userId: formData.phone, // mobile as unique user
        //   schemeId,
        //   ...formData,
        // }),
      });

      if (res.status === 409) {
        alert("You already applied for this scheme.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Server error");
      }

      alert("Application submitted successfully ✅");
      onClose();
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">{schemeName}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-2 rounded-lg"
          />

          {/* Mobile */}
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border p-2 rounded-lg"
          />

          {/* Email */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className="w-full border p-2 rounded-lg"
          />

          {/* ✅ Relation selector */}
          <select
            required
            name="relationType"
            value={formData.relationType}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Relation</option>
            <option value="Father">Father Name</option>
            <option value="Mother">Mother Name</option>
            <option value="Spouse">Spouse Name</option>
          </select>

          <input
            required
            name="relationName"
            value={formData.relationName}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full border p-2 rounded-lg"
          />

          {/* Gender */}
          <select
            required
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Category */}
          <select
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          {/* State */}
          <select
            required
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select State</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
          </select>

          {/* Aadhaar */}
          <input
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            placeholder="Aadhaar (optional)"
            className="w-full border p-2 rounded-lg"
          />

          {/* Address */}
          <textarea
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-2 rounded-lg"
          />

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full border py-2 rounded-xl"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}