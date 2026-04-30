"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  // Filter and sort state
  const [classification, setClassification] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("Title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [formData, setFormData] = useState({
    Title: "",
    Artist: "",
    Date: "",
    Medium: "",
    Classification: "",
    Department: "",
  });

  // Validation errors for the form
  const [formErrors, setFormErrors] = useState({});

  // Submitting flag to disable the button while a request is in flight
  const [submitting, setSubmitting] = useState(false);

  // Toast notification — { message, type: "success" | "error" }
  const [toast, setToast] = useState(null);

  // Show a toast for 3 seconds then clear it
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Seed the database on first load
  useEffect(() => {
    async function seed() {
      try {
        await axios.get("/api/seed");
      } catch {
        showToast("Failed to seed database", "error");
      }
      setSeeded(true);
    }
    seed();
  }, []);

  // Re-fetch whenever page, seed status, filters, or sort changes
  useEffect(() => {
    if (!seeded) return;
    fetchArtworks();
  }, [page, seeded, classification, department, sortBy, sortOrder]);

  async function fetchArtworks(searchTerm = search) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        search: searchTerm,
        classification,
        department,
        sortBy,
        sortOrder,
      });
      const { data } = await axios.get(`/api/artworks?${params}`);
      setArtworks(data.artworks);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      showToast("Failed to load artworks. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchArtworks(search);
  }

  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for this field as the user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  }

  // Returns an errors object — empty means the form is valid
  function validateForm() {
    const errors = {};
    if (!formData.Title.trim()) {
      errors.Title = "Title is required";
    }
    if (!formData.Artist.trim()) {
      errors.Artist = "At least one artist is required";
    }
    if (formData.Date && !/^\d{0,4}s?$/.test(formData.Date.trim())) {
      errors.Date = "Date should be a year (e.g. 1920) or decade (e.g. 1920s)";
    }
    return errors;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        ...formData,
        Artist: formData.Artist.split(",").map((a) => a.trim()).filter(Boolean),
      };

      if (editingArtwork) {
        await axios.put(`/api/artworks/${editingArtwork._id}`, body);
        showToast("Artwork updated successfully");
      } else {
        await axios.post("/api/artworks", body);
        showToast("Artwork added successfully");
      }

      setShowForm(false);
      setEditingArtwork(null);
      setFormErrors({});
      setFormData({ Title: "", Artist: "", Date: "", Medium: "", Classification: "", Department: "" });
      fetchArtworks();
    } catch {
      showToast(
        editingArtwork ? "Failed to update artwork" : "Failed to add artwork",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(artwork) {
    setEditingArtwork(artwork);
    setFormErrors({});
    setFormData({
      Title: artwork.Title || "",
      Artist: (artwork.Artist || []).join(", "),
      Date: artwork.Date || "",
      Medium: artwork.Medium || "",
      Classification: artwork.Classification || "",
      Department: artwork.Department || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await axios.delete(`/api/artworks/${id}`);
      showToast("Artwork deleted");
      fetchArtworks();
    } catch {
      showToast("Failed to delete artwork", "error");
    }
  }

  return (
    <div>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-opacity ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-gray-500 mt-1">{total} artworks in collection</p>
        </div>

        <div className="flex gap-3">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or artist..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Add artwork button */}
          <button
            onClick={() => {
              setEditingArtwork(null);
              setFormErrors({});
              setFormData({ Title: "", Artist: "", Date: "", Medium: "", Classification: "", Department: "" });
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add Artwork
          </button>
        </div>
      </div>

      {/* Filter and sort controls */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={classification}
          onChange={handleFilterChange(setClassification)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Classifications</option>
          <option value="Painting">Painting</option>
          <option value="Drawing">Drawing</option>
          <option value="Photography">Photography</option>
          <option value="Print">Print</option>
          <option value="Illustrated Book">Illustrated Book</option>
          <option value="Sculpture">Sculpture</option>
          <option value="Design">Design</option>
          <option value="Film">Film</option>
          <option value="Video">Video</option>
          <option value="Architecture">Architecture</option>
        </select>

        <select
          value={department}
          onChange={handleFilterChange(setDepartment)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          <option value="Painting & Sculpture">Painting &amp; Sculpture</option>
          <option value="Drawings & Prints">Drawings &amp; Prints</option>
          <option value="Photography">Photography</option>
          <option value="Architecture & Design">Architecture &amp; Design</option>
          <option value="Film">Film</option>
          <option value="Media and Performance">Media and Performance</option>
        </select>

        <select
          value={sortBy}
          onChange={handleFilterChange(setSortBy)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Title">Sort by Title</option>
          <option value="Date">Sort by Date</option>
          <option value="Artist">Sort by Artist</option>
        </select>

        <select
          value={sortOrder}
          onChange={handleFilterChange(setSortOrder)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">A → Z / Oldest</option>
          <option value="desc">Z → A / Newest</option>
        </select>

        {(classification || department || sortBy !== "Title" || sortOrder !== "asc") && (
          <button
            onClick={() => {
              setClassification("");
              setDepartment("");
              setSortBy("Title");
              setSortOrder("asc");
              setPage(1);
            }}
            className="text-sm text-red-500 hover:text-red-700 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
          </h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
            {/* Title */}
            <div className="flex flex-col gap-1">
              <input
                name="Title"
                value={formData.Title}
                onChange={handleFormChange}
                placeholder="Title *"
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.Title ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {formErrors.Title && (
                <span className="text-xs text-red-500">{formErrors.Title}</span>
              )}
            </div>

            {/* Artist */}
            <div className="flex flex-col gap-1">
              <input
                name="Artist"
                value={formData.Artist}
                onChange={handleFormChange}
                placeholder="Artist (comma-separated) *"
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.Artist ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {formErrors.Artist && (
                <span className="text-xs text-red-500">{formErrors.Artist}</span>
              )}
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <input
                name="Date"
                value={formData.Date}
                onChange={handleFormChange}
                placeholder="Date (e.g. 1920)"
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.Date ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {formErrors.Date && (
                <span className="text-xs text-red-500">{formErrors.Date}</span>
              )}
            </div>

            <input
              name="Medium"
              value={formData.Medium}
              onChange={handleFormChange}
              placeholder="Medium"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="Classification"
              value={formData.Classification}
              onChange={handleFormChange}
              placeholder="Classification"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="Department"
              value={formData.Department}
              onChange={handleFormChange}
              placeholder="Department"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : editingArtwork ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormErrors({}); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm">Loading artworks...</p>
        </div>
      ) : (
        <>
          {/* Empty state */}
          {artworks.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No artworks found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Artwork grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {artwork.ImageURL ? (
                  <img
                    src={artwork.ImageURL}
                    alt={artwork.Title}
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                    {artwork.Title}
                  </h3>
                  <p className="text-gray-600 text-sm">{artwork.Artist?.join(", ")}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {artwork.Date} &middot; {artwork.Classification}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artwork._id)}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
