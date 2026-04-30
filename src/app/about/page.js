export const metadata = {
  title: "About — MoMA Art Collection",
  description: "How the MoMA Art Collection app works, technologies used, limitations, and alternatives",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold">About This App</h1>
        <p className="text-gray-500 mt-2">
          A full-stack web application for browsing, searching, and managing
          artworks from the Museum of Modern Art (MoMA) collection.
        </p>
      </div>

      {/* How it works */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          The application follows a client-server architecture. The React
          frontend communicates with a Next.js API backend via HTTP requests,
          and the backend stores and retrieves artwork data from a MongoDB
          database. All communication uses RESTful conventions.
        </p>

        {/* Architecture diagram */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Architecture Diagram
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
            {/* Client */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 w-full md:w-56">
              <p className="font-semibold text-blue-800">Client (Browser)</p>
              <p className="text-sm text-blue-600 mt-1">
                React UI with Tailwind CSS
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Search, Browse, Add, Edit, Delete
              </p>
            </div>

            {/* Arrow */}
            <div className="text-gray-400 text-2xl md:rotate-0 rotate-90">
              &harr;
            </div>

            {/* Server */}
            <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 w-full md:w-56">
              <p className="font-semibold text-green-800">API Server</p>
              <p className="text-sm text-green-600 mt-1">
                Next.js Route Handlers
              </p>
              <p className="text-xs text-green-500 mt-1">
                REST endpoints (CRUD)
              </p>
            </div>

            {/* Arrow */}
            <div className="text-gray-400 text-2xl md:rotate-0 rotate-90">
              &harr;
            </div>

            {/* Database */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 w-full md:w-56">
              <p className="font-semibold text-amber-800">Database</p>
              <p className="text-sm text-amber-600 mt-1">
                MongoDB (In-Memory)
              </p>
              <p className="text-xs text-amber-500 mt-1">
                Mongoose ODM
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            The client sends HTTP requests (GET, POST, PUT, DELETE) to the
            API server, which queries MongoDB and returns JSON responses.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-gray-800">Application Flow</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              On first load, the app seeds the database by reading{" "}
              <code className="bg-gray-100 px-1 rounded text-sm">Artworks.json</code>{" "}
              and inserting 10,000 artworks into MongoDB.
            </li>
            <li>
              The gallery page fetches paginated artworks from{" "}
              <code className="bg-gray-100 px-1 rounded text-sm">GET /api/artworks</code>{" "}
              and displays them in a responsive grid.
            </li>
            <li>
              Users can search by title or artist, which filters results
              server-side using MongoDB regex queries.
            </li>
            <li>
              Users can add new artworks via{" "}
              <code className="bg-gray-100 px-1 rounded text-sm">POST /api/artworks</code>,
              edit via{" "}
              <code className="bg-gray-100 px-1 rounded text-sm">PUT /api/artworks/:id</code>,
              and delete via{" "}
              <code className="bg-gray-100 px-1 rounded text-sm">DELETE /api/artworks/:id</code>.
            </li>
          </ol>
        </div>
      </section>

      {/* Technologies used */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "Next.js 16",
              description:
                "React framework providing file-based routing, API route handlers, and server-side rendering.",
            },
            {
              name: "React 19",
              description:
                "JavaScript library for building the interactive user interface with component-based architecture.",
            },
            {
              name: "MongoDB (In-Memory)",
              description:
                "NoSQL document database running in-memory via mongodb-memory-server — no external DB installation needed.",
            },
            {
              name: "Mongoose",
              description:
                "Object Data Modelling (ODM) library for MongoDB, providing schema validation and query building.",
            },
            {
              name: "Axios",
              description:
                "Promise-based HTTP client for making API requests from the frontend to the backend.",
            },
            {
              name: "Tailwind CSS 4",
              description:
                "Utility-first CSS framework for rapidly building custom, responsive designs without writing custom CSS.",
            },
          ].map((tech) => (
            <div
              key={tech.name}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800">{tech.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
        <ul className="space-y-3">
          {[
            {
              title: "In-Memory Database",
              detail:
                "Data is lost every time the server restarts. MongoDB Memory Server is ideal for development and testing but not suitable for production use.",
            },
            {
              title: "No Authentication",
              detail:
                "Any user can add, edit, or delete artworks. There is no login system or role-based access control to protect data.",
            },
            {
              title: "No Image Hosting",
              detail:
                "Artwork images rely on external MoMA URLs. If those URLs change or go offline, images will not display.",
            },
            {
              title: "Limited Dataset",
              detail:
                "The app seeds 1,000 artworks for development purposes. The full MoMA collection contains over 140,000 items.",
            },
            {
              title: "No Input Validation",
              detail:
                "The API accepts any data shape on create/update without strict server-side validation or sanitisation.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Alternatives */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Alternative Approaches
        </h2>
        <ul className="space-y-3">
          {[
            {
              title: "Express.js instead of Next.js",
              detail:
                "A traditional Express server with a separate React frontend (Create React App or Vite) could achieve the same result. Next.js was chosen for its integrated routing and API handlers, reducing boilerplate.",
            },
            {
              title: "MongoDB Atlas instead of In-Memory",
              detail:
                "A cloud-hosted MongoDB Atlas cluster would provide persistent storage, backups, and scalability. The in-memory approach was chosen for zero-config development.",
            },
            {
              title: "PostgreSQL instead of MongoDB",
              detail:
                "A relational database like PostgreSQL with an ORM such as Prisma could enforce stricter schemas and relationships, which suits structured data well.",
            },
            {
              title: "Angular or Vue.js instead of React",
              detail:
                "Other frontend frameworks could be used. Angular offers a more opinionated structure with built-in services, while Vue provides a gentler learning curve.",
            },
            {
              title: "GraphQL instead of REST",
              detail:
                "GraphQL would allow clients to request exactly the fields they need, reducing over-fetching. REST was chosen for simplicity and alignment with the course material.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
