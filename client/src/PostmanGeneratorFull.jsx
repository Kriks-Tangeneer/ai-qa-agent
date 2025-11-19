import React, { useState } from "react";
import MarkdownPreview from "./components/MarkdownPreview";

export default function PostmanGeneratorFull() {
  // Form states
  const [serviceName, setServiceName] = useState("");
  const [endpointName, setEndpointName] = useState("");
  const [method, setMethod] = useState("GET");
  const [expectedResponseCode, setExpectedResponseCode] = useState("200");
  const [expectedResponseStatus, setExpectedResponseStatus] = useState("OK");
  const [expectedResponseBody, setExpectedResponseBody] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic form validity check
  const isFormValidBasic =
    serviceName.trim() &&
    endpointName.trim() &&
    expectedResponseCode.trim() &&
    expectedResponseStatus.trim();

  // Function to export content as a file
  function exportFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Validation function
  const validate = () => {
    const newErrors = {};
    // Validate service and endpoint names
    if (!serviceName.trim()) newErrors.serviceName = "Service name is required.";
    if (!endpointName.trim()) newErrors.endpointName = "Endpoint name is required.";

    // Validate method
    if (!method) newErrors.method = "HTTP method is required.";

    // Validate response code
    if (!expectedResponseCode.trim()) {
      newErrors.expectedResponseCode = "Expected response code is required.";
    } else if (isNaN(Number(expectedResponseCode))) {
      newErrors.expectedResponseCode = "Response code must be a number.";
    }

    // Validate response status
    if (!expectedResponseStatus.trim()) {
      newErrors.expectedResponseStatus = "Expected response status is required.";
    }

    // Validate JSON body (optional)
    if (responseBody.trim()) {
      try {
        JSON.parse(responseBody);
      } catch (e) {
        newErrors.responseBody = "Expected response body must be valid JSON.";
      }
    }

    // Update errors state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleGenerate(e) {
    //if (!validate()) return; // ⛔ Stop if invalid

    // Prevent default form submission
    e && e.preventDefault();
    setLoading(true);
    setResult("");

    // Prepare request body
    try {
      const body = {
        serviceName: serviceName,
        endpointName: endpointName,
        method: method,
        expectedResponseCode: expectedResponseCode,
        expectedResponseStatus: expectedResponseStatus,
        expectedResponseBody: expectedResponseBody,
      };

      // Send request to backend
      const res = await fetch("http://localhost:4000/generate/api-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      // Handle response
      if (data.result) {
        // Present as a JS code block in the markdown previewer so it benefits from code styling + copy buttons
        setResult("```javascript\n" + data.result + "\n```");
      } else if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult("No result from server.");
      }

    }

    // Catch network or server errors
    catch (err) {
      console.error(err);
      alert("Server error or network error.");
    } finally {
      setLoading(false);
    }
  }

  // Main render
  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="mx-auto space-y-6" style={{ width: '80%' }}>
        <h1 className="text-3xl font-bold">API Postman Test Generator</h1>
        <form onSubmit={handleGenerate} className="grid gap-4">

          {/* Service Name input */}
          <label className="font-medium flex items-center gap-1">
            Service Name
            <span className="text-red-500">*</span>
          </label>

          <input
            className={`p-2 rounded border dark:bg-gray-800 dark:border-gray-700
              ${errors.serviceName ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : "border-gray-300"}
              dark:bg-[#1e1e1e]`}
            placeholder="Service Name (e.g. OrderService)"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          {errors.serviceName && (
            <p className="text-red-500 text-sm mt-1">{errors.serviceName}</p>
          )}

          {/* Endpoint Name input */}
          <label className="font-medium flex items-center gap-1">
            Endpoint Name
            <span className="text-red-500">*</span>
          </label>

          <input
            className={`p-2 rounded border dark:bg-gray-800 dark:border-gray-700
              ${errors.endpointName ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : "border-gray-300"}
              dark:bg-[#1e1e1e]`}
            placeholder="Endpoint Name (e.g. GetOrder)"
            value={endpointName}
            onChange={(e) => setEndpointName(e.target.value)}
          />
          {errors.endpointName && (
            <p className="text-red-500 text-sm mt-1">{errors.endpointName}</p>
          )}

          {/* Method dropdown inputs */}
          <div className="flex gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>

            {/* Expected Response Code input */}
            <label className="font-medium flex items-center gap-1">
              Expected Response Code
              <span className="text-red-500">*</span>
            </label>

            <input
              className={`p-2 rounded border dark:bg-gray-800 dark:border-gray-700
                ${errors.expectedResponseCode ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : "border-gray-300"}
                dark:bg-[#1e1e1e]`}
              placeholder="Expected Response Code (e.g. 200)"
              value={expectedResponseCode}
              onChange={(e) => setExpectedResponseCode(e.target.value)}
            />
            {errors.expectedResponseCode && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedResponseCode}</p>
            )}

            {/* Expected Response Status input */}
            <label className="font-medium flex items-center gap-1">
              Expected Response Status
              <span className="text-red-500">*</span>
            </label>

            <input
              className={`p-2 rounded border dark:bg-gray-800 dark:border-gray-700
                ${errors.expectedResponseStatus ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : "border-gray-300"}
                dark:bg-[#1e1e1e]`}
              placeholder="OK"
              value={expectedResponseStatus}
              onChange={(e) => setExpectedResponseStatus(e.target.value)}
            />
            {errors.expectedResponseStatus && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedResponseStatus}</p>
            )}

          </div>
          {/* Expected Response Body input */}
          <label className="font-medium">Expected Response Body (JSON optional)</label>
          <textarea
            className={`border p-2 w-full h-40 rounded bg-white dark:bg-gray-800 text-black dark:text-white
              ${errors.responseBody ? "border-red-500 ring-2 ring-red-500 ring-offset-1" : "border-gray-300"}
              dark:bg-[#1e1e1e]`}
            placeholder='Expected JSON response, e.g. {"success": true, "message": "Created successfully"}'
            value={expectedResponseBody}
            onChange={e => setExpectedResponseBody(e.target.value)}
          />
          {errors.responseBody && (
            <p className="text-red-500 text-sm mt-1">{errors.responseBody}</p>
          )}

          <div className="flex gap-3">
            <div className="relative group inline-block">
              <button
                type="submit"
                disabled={loading || !isFormValidBasic}
                className={`px-4 py-2 rounded text-white transition
                  ${!isFormValidBasic
                    ? "bg-red-500 cursor-not-allowed"
                    : loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Generating..." : "Generate Tests"}
              </button>

              {/* Tooltip with arrow */}
              {!isFormValidBasic && (
                <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2
                    bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Please fill in all mandatory fields.

                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 
                      w-0 h-0 
                      border-l-8 border-l-transparent
                      border-r-8 border-r-transparent
                      border-b-8 border-b-gray-900"></div>
                </div>
              )}
            </div>


            {/* Reset button */}
            <button
              type="button"
              onClick={() => {
                setServiceName("");
                setEndpointName("");
                setMethod("GET");
                setExpectedResponseCode("200");
                setExpectedResponseStatus("");
                setExpectedResponseBody("");
                setResult("");
              }}
              className="px-4 py-2 rounded border"
            >
              Reset
            </button>

          </div>
        </form>

        {/* Result display */}
        {result && (
          <div className="mt-4 p-6 rounded bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">Generated Postman test script</div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {/* Copy Script Button */}
                <button
                  onClick={() => navigator.clipboard.writeText(result.replace(/^```javascript\n|```$/g, ""))}
                  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
                >
                  Copy script
                </button>

                {/* Export as .js Button */}
                <button
                  onClick={() =>
                    exportFile("postman-test.js", result.replace(/^```javascript\n|```$/g, ""), "application/javascript")
                  }
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Export .js
                </button>
              </div>
            </div>

            {/* Markdown Preview */}
            <div className="prose max-w-none">
              <MarkdownPreview content={result} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}