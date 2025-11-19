# AI QA Agent

An end‑to‑end assistant built for **functional testers**, **API testers**, and **QA engineers**. The agent accepts a user story (title, description, acceptance criteria) and optionally an API schema to generate:

## ✅ Features

### **1. User Story Summary**

Breaks down complex user stories into clear, simple, easy‑to‑digest summaries for:

* Sprint planning
* Story sizing
* Helping testers understand intent and scope

### **2. Functional Test Case Generation**

Automatically generates:

* Happy path test cases
* Negative scenarios
* Edge cases
* UI/Frontend test cases
* Backend/API test cases
* Data validation tests
* Error-handling and boundary tests

### **3. Postman Test Script Generation (Optional)**

If an API response schema is supplied (in JSON format), the agent generates:

* Postman `pm.test()` assertions
* Field presence checks
* Type validations
* Negative schema validations

### **4. Advanced API Test Generator (New Feature)**

On a dedicated page, you can generate **deeper Postman test scripts** using a predefined template. Input the following:

* Service Name
* Endpoint Name
* HTTP Method (GET, POST, PUT, DELETE)
* Expected Response Code
* Expected Response Status
* Response Schema / Body

The AI agent will produce:

* A fully structured Postman test script in JavaScript
* Field presence and datatype validations
* Conditional functional tests based on response status
* Comments for where to add additional checks if schema is missing
* **NEW:** Functional tests inferred from the JSON response  
  - e.g., `"success": true`, `"message": "Created successfully"`, arrays with minimum items, enums, ID validation, positivity checks, etc.
* Empty functional test block only when no meaningful assertions can be made  

This allows QA engineers to generate ready-to-use Postman test scripts **at a deeper level**, following a consistent template.

### **5. Markdown Preview + Export Options**

Results are rendered using a Markdown previewer with:

* **Copy button**
* **Export to .md, .txt, .json**

### **6. Dark Mode Toggle**

UI supports both light and dark themes.

### **7. Loading Spinner + Button Disable**

Prevents duplicate requests and improves UX.

---

# 📁 Project Structure

```
ai-qa-agent/
│
├── server/
│   ├── app.js          # Express server
│   ├── index.js        # Entry point
│   ├── package.json
│   └── .env            # Contains: OPENAI_API_KEY=your_key_here
│
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── PostmanGeneratorFull.jsx  # New page for advanced API test generation
    │   ├── components/
    │   │   └── MarkdownPreview.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

# 🚀 Installation & Setup

## **1. Clone the project**

```bash
git clone https://github.com/Kriks-Tangeneer/ai-qa-agent.git
cd ai-qa-agent
```

## **2. Setup the server**

```bash
cd server
npm install
```

Create `.env` in the **server** folder:

```
OPENAI_API_KEY=your_key_here
```

Start the server:

```bash
npm start
```

Server runs on:

```
http://localhost:4000
```

---

## **3. Setup the client**

```bash
cd ../client
npm install
npm run dev
```

Client runs on:

```
http://localhost:5173
```

---

# ✨ How to Use

### **AI QA Agent (User Story / Tests)**

1. Open the client in your browser.
2. Enter:

   * User story title
   * Description
   * Acceptance criteria (one per line)
   * Optional: API schema in JSON format
3. Click **Generate Summary + Tests**.
4. See:

   * User story summary
   * Detailed test cases
   * Optional Postman test script
5. Export results as `.md`, `.txt`, or `.json`.
6. Use the dark mode toggle as needed.

---

### **Advanced API Test Generator**

1. Navigate to **API Test Generator** from the header.
2. Enter:

   * Service Name
   * Endpoint Name
   * HTTP Method
   * Expected Response Code
   * Expected Response Status
   * Optional: Response Schema / Body (JSON)
3. Click **Generate Postman Test Script**.
4. Copy or export the generated script and paste it into Postman’s **Tests tab**.

---

# 🧠 Navigation Diagram

```text
+----------------------------+
|     AI QA Agent Home       |
|----------------------------|
| - User Story Input         |
| - Description              |
| - Acceptance Criteria      |
| - API Schema (optional)    |
| - Generate Summary + Tests |
+----------------------------+
            |
            v
+----------------------------+
|  API Test Generator        |
|----------------------------|
| - Service Name             |
| - Endpoint Name            |
| - HTTP Method              |
| - Expected Response Code   |
| - Expected Response Status |
| - Response Schema/Body     |
| - Generate Postman Test    |
+----------------------------+
            ^
            |
     [Header Navigation]
```

---

# 🧠 Server Endpoint Overview

### **POST /generate-tests**

Sends user story data to OpenAI and returns a combined Markdown output containing:

* Summary
* Test cases
* Postman test script (if schema provided)

### **POST /generate/api-tests**

Sends API endpoint details to OpenAI and returns:

* Fully structured Postman test script in JavaScript
* Uptime, field presence and datatype validations
* Comments for placeholder checks if schema is missing
* Functional tests derived automatically from JSON
* Empty functional section only when nothing meaningful can be inferred

This endpoint now uses enhanced prompting to analyze your JSON deeply and produce high-quality validation logic.

---

# 🛠 Technologies Used

### **Backend**

* Node.js / Express
* OpenAI API
* dotenv
* CORS

### **Frontend**

* React (Vite)
* TailwindCSS (Dark mode enabled)
* react-markdown + remark-gfm

---

# 📌 Notes

* You may safely commit `.env` **with** `OPENAI_API_KEY=your_key_here` placeholder (never your real key).
* API schema must be valid JSON or the server will return an error.
* AI generation may take a few seconds — this is normal.

---

## 🔒 Security Notes

* The `.env` file is committed but does **not** expose your real API key.
* Replace `your_key_here` with your actual key locally.
* Never commit real credentials.

---

## 📌 Future Enhancements

* Postman collection auto-generation
* Multi‑agent support (frontend tester + backend tester personalities)
* Multi-agent architecture (Parser Agent + Test Generator Agent)
* Test data generator (Faker library)
* UI to export test cases to CSV / JSON
* Ability to upload Swagger/OpenAPI files
* Database storage for user stories
* Authentication for multi-user environments

---

## 📄 License

MIT License. Free to use, modify, and share.

---

## 🤝 Contributing

Pull requests are welcome. For large changes, please open an issue first to discuss your ideas.

---

## 👨‍💻 Author

Built by a QA Engineer for QA Engineers ❤ — making testing smarter, not harder.

---

## 📧 Support

If you need help or want new features added, feel free to reach out!
