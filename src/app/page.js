"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  // State — these variables control what's shown on the page
  const [artworks, setArtworks] = useState([]); // list of artworks from the API
  const [page, setPage] = useState(1); // current page number
  const [totalPages, setTotalPages] = useState(1); // total number of pages
  const [total, setTotal] = useState(0); // total artwork count
  const [search, setSearch] = useState(""); // search input value
  const [loading, setLoading] = useState(true); // loading spinner flag
  const [seeded, setSeeded] = useState(false); // has the database been seeded?

  // Filter and sort state
  const [classification, setClassification] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("Title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Form state for adding/editing artworks
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

  // Seed the database on first load
  // This calls /api/seed which loads Artworks.json into MongoDB
  useEffect(() => {
    async function seed() {
      await axios.get("/api/seed");
      setSeeded(true);
    }
    seed();
  }, []);

  // Fetch artworks whenever page, seed, filters, or sort changes
  useEffect(() => {
    if (!seeded) return;
    fetchArtworks();
  }, [page, seeded, classification, department, sortBy, sortOrder]);

  // Fetch artworks from our API
  async function fetchArtworks(searchTerm = search) {
    setLoading(true);
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
    setLoading(false);
  }

  // Handle search — reset to page 1 and fetch with the search term
  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchArtworks(search);
  }

  // Handle filter/sort changes — reset to page 1 automatically
  function handleFilterChange(setter) {
    return (e) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  // Handle form input changes
  function handleFormChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handle form submit — either create or update an artwork
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Build the body — Artist needs to be an array
    const body = {
      ...formData,
      Artist: formData.Artist.split(",").map((a) => a.trim()),
    };

    if (editingArtwork) {
      // UPDATE — PUT request to /api/artworks/[id]
      // axios automatically sets Content-Type and stringifies the body
      await axios.put(`/api/artworks/${editingArtwork._id}`, body);
    } else {
      // CREATE — POST request to /api/artworks
      await axios.post("/api/artworks", body);
    }

    // Reset form and refresh the list
    setShowForm(false);
    setEditingArtwork(null);
    setFormData({ Title: "", Artist: "", Date: "", Medium: "", Classification: "", Department: "" });
    fetchArtworks();
  }

  // Open the form pre-filled for editing
  function handleEdit(artwork) {
    setEditingArtwork(artwork);
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

  // DELETE — sends DELETE request to /api/artworks/[id]
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    await axios.delete(`/api/artworks/${id}`);
    fetchArtworks();
  }

  return (
    <div>
      {/* Header section with search and add button */}
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
        {/* Classification filter */}
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

        {/* Department filter */}
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

        {/* Sort field */}
        <select
          value={sortBy}
          onChange={handleFilterChange(setSortBy)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Title">Sort by Title</option>
          <option value="Date">Sort by Date</option>
          <option value="Artist">Sort by Artist</option>
        </select>

        {/* Sort direction */}
        <select
          value={sortOrder}
          onChange={handleFilterChange(setSortOrder)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">A → Z / Oldest</option>
          <option value="desc">Z → A / Newest</option>
        </select>

        {/* Clear filters button — only shown when a filter is active */}
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

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
          </h2>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="Title" value={formData.Title} onChange={handleFormChange} placeholder="Title" required className="border border-gray-300 rounded-lg px-4 py-2" />
            <input name="Artist" value={formData.Artist} onChange={handleFormChange} placeholder="Artist (comma-separated)" className="border border-gray-300 rounded-lg px-4 py-2" />
            <input name="Date" value={formData.Date} onChange={handleFormChange} placeholder="Date (e.g. 1920)" className="border border-gray-300 rounded-lg px-4 py-2" />
            <input name="Medium" value={formData.Medium} onChange={handleFormChange} placeholder="Medium" className="border border-gray-300 rounded-lg px-4 py-2" />
            <input name="Classification" value={formData.Classification} onChange={handleFormChange} placeholder="Classification" className="border border-gray-300 rounded-lg px-4 py-2" />
            <input name="Department" value={formData.Department} onChange={handleFormChange} placeholder="Department" className="border border-gray-300 rounded-lg px-4 py-2" />
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {editingArtwork ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading artworks...</div>
      ) : (
        <>
          {/* Artwork grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Artwork image */}
                {artwork.ImageURL ? (
                  <img
                    src={artwork.ImageURL}
                    alt={artwork.Title}
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* Artwork info */}
                <div className="p-4">
                  <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                    {artwork.Title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {artwork.Artist?.join(", ")}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {artwork.Date} &middot; {artwork.Classification}
                  </p>

                  {/* Edit and Delete buttons */}
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

          {/* Pagination controls */}
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
        </>
      )}
    </div>
  );
}
