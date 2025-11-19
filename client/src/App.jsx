import { useState } from "react";
import MarkdownPreview from "./components/MarkdownPreview";


export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [ac, setAc] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  // Function to export content as a file
  function exportFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  // Function to copy text to clipboard
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  // Function to validate inputs
  const validate = () => {
    const newErrors = {};

    // Validate required fields
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!desc.trim()) newErrors.desc = "Description is required.";
    if (!ac.trim()) newErrors.ac = "At least one acceptance criterion is required.";

    // Validate optional JSON schema
    if (schema.trim()) {
      try {
        JSON.parse(schema);
      } catch (e) {
        newErrors.schema = "API Schema must be valid JSON.";
      }
    }

    // Update error state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Function to handle test generation
  async function generate() {
    if (!validate()) return; // ⛔ Stop if invalid

    // Clear previous results and set loading state
    setLoading(true);
    setResult("");

    // Prepare and send request to backend
    try {
      const body = {
        title: title,
        description: desc,
        acceptanceCriteria: ac.split("\n").map(x => x.trim()),
        apiSchema: schema ? JSON.parse(schema) : null
      };

      // Send request to backend
      const r = await fetch("http://localhost:4000/generate/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      // Handle response
      const data = await r.json();
      setResult(data.result);
    } 
    // Handle errors
    catch (err) {
      alert("Invalid JSON schema or server error.");
    }
    // Reset loading state
    setLoading(false);
  }


  // Main render
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="p-8 mx-auto space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100" style={{ width: '80%' }}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">AI QA Tester Agent</h1>
          </div>

          {/* Title input */}
          <label className="font-medium flex items-center gap-1">
            Title Input
            <span className="text-red-500">*</span>
          </label>

          <input
            className={`border p-2 w-full rounded bg-white dark:bg-gray-800 text-black dark:text-white
            ${errors.title ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : ""}`}
            placeholder="User Story Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

          {/* Description input */}
          <label className="font-medium flex items-center gap-1">
            Description Input
            <span className="text-red-500">*</span>
          </label>

          <textarea
            className={`border p-2 w-full h-32 rounded bg-white dark:bg-gray-800 text-black dark:text-white
            ${errors.desc ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : ""}`}
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          {errors.desc && <p className="text-red-500 text-sm mt-1">{errors.desc}</p>}

          {/* Acceptance Criteria input */}
          <label className="font-medium flex items-center gap-1">
            Acceptance Criteria Input
            <span className="text-red-500">*</span>
          </label>

          <textarea
            className={`border p-2 w-full h-32 rounded bg-white dark:bg-gray-800 text-black dark:text-white
            ${errors.ac ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : ""}`}
            placeholder="Acceptance Criteria (one per line) (Mandatory)"
            value={ac}
            onChange={e => setAc(e.target.value)}
          />
          {errors.ac && <p className="text-red-500 text-sm mt-1">{errors.ac}</p>}

          {/* API Schema input */}
          <label className="font-medium flex items-center gap-1">
            API Schema Input (Optional)
          </label>

          <textarea
            className={`border p-2 w-full h-32 rounded bg-white dark:bg-gray-800 text-black dark:text-white
            ${errors.schema ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : ""}`}
            placeholder='API Schema (JSON) (Optional), e.g. {"id":"string","amount":"number"}'
            value={schema}
            onChange={e => setSchema(e.target.value)}
          />
          {errors.schema && <p className="text-red-500 text-sm mt-1">{errors.schema}</p>}

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            className={`px-4 py-2 rounded text-white
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </div>
            ) : (
              "Generate"
            )}
          </button>

          {/* Result display */}
          {result && (
            <div className="relative mt-6 p-6 rounded bg-gray-200 dark:bg-gray-800 overflow-auto">

              {/* Copy button */}
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Copy
              </button>

              {/* GitHub-style Markdown */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <MarkdownPreview content={result} />
              </div>

              {/* EXPORT BUTTONS */}
              <div className="flex gap-3 mt-4">
                
                {/* Export as markdown button */}
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => exportFile("test-output.md", result, "text/markdown")}
                >
                  Export .md
                </button>

                {/* Export as text button */}
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  onClick={() => exportFile("test-output.txt", result, "text/plain")}
                >
                  Export .txt
                </button>

                {/* Export as JSON button */}
                <button
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  onClick={() => {
                    const jsonData = JSON.stringify({ output: result }, null, 2);
                    exportFile("test-output.json", jsonData, "application/json");
                  }}
                >
                  Export .json
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}