import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Example route for generating test cases
app.post("/generate/tests", async (req, res) => {
  try {

    // Extract data from request body
    const { title, description, acceptanceCriteria, apiSchema } = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ error: "Missing title or description" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `
              You are an expert QA test engineer. Your goal is to help functional testers and QA engineers by summarizing user stories and generating detailed test cases in clean, readable Markdown. 
              Follow the instructions below exactly.`
        },
        {
          role: "user",
          content: `
            USER STORY TITLE:
            ${title}

            DESCRIPTION:
            ${description}

            ACCEPTANCE CRITERIA:
            ${acceptanceCriteria && acceptanceCriteria.length > 0 ? acceptanceCriteria.join("\n") : "None"}

            API SCHEMA:
            ${apiSchema ? JSON.stringify(apiSchema, null, 2) : "None"}

            Please produce the output in **Markdown format** exactly as follows:

            ---

            # 1️⃣ User Story Summary
            - Core Functionality: Describe what the system should do.
            - Purpose: Why is this user story needed?
            - Actors: Who is involved (user, system, external systems)?
            - Success Outcome: What does successful completion look like?

            # 2️⃣ High-Level Test Scenarios (Titles Only)
            - Provide a numbered list of concise test scenario titles (do not include steps yet).  
            - Include happy path, negative, edge cases, and validation scenarios.

            # 3️⃣ Detailed Test Cases
            For each test scenario listed above, provide in the following format:

            ### Test Scenario {number}: {title}
            **Preconditions:** Describe the initial state or setup required.  
            **Test Steps:** Step-by-step instructions to execute the test.  
            **Expected Result:** What should happen when the steps are executed.

            # 4️⃣ Postman Tests (Only if API schema provided)
            - Provide code snippets in Postman.  
            - Validate field presence, types, and negative scenarios.

            **Additional Instructions:**
            - Do not use tables.
            - Format using Markdown headings, lists, and code blocks.
            - Be concise but complete, especially for summary: always include core functionality, purpose, actors, and success outcome.
            - Use bullet points and sub-headings for readability.
            `
        }
      ]
    });

    // Send back the AI-generated content
    res.json({
      result: response.choices[0].message.content
    });

  } catch (err) {
    console.error("❌ AI generation failed:", err);
    res.status(500).json({ error: "AI generation failed." });
  }
});

// Paste into server/index.js (make sure dotenv.config() and OpenAI client exist)
app.post("/generate/api-tests", async (req, res) => {
  try {
    const {
      serviceName,
      endpointName,
      method = "GET",
      expectedResponseCode = "200",
      expectedResponseStatus = "OK",
      expectedResponseBody = null
    } = req.body;

    if (!serviceName || !endpointName) {
      return res.status(400).json({ error: "serviceName and endpointName are required" });
    }

    // Improved prompt: produce only the JavaScript Postman test script (no extra prose)
    const prompt = `
                        You are an expert QA engineer who writes Postman test scripts. Use the Postman test template below and replace placeholders with the provided inputs.
                        Return ONLY the final JavaScript test script (do NOT add extra explanation).

                        Template (replace tokens in square brackets):

                        // ===========================================
                        // Request: [METHOD] [URL]
                        // Purpose: [Description]
                        // Auth:    [Auth Type] [Auth Details]
                        // Expected status: [RESPONSE_CODE] [RESPONSE_STATUS]
                        // ===========================================

                        // 🧩 ~~ Test Configuration ~~ 🧩
                        var runBaselineTests = pm.collectionVariables.get("runBaselineTests");             
                        var runFieldDefintionTests = pm.collectionVariables.get("runFieldDefintionTests");  
                        var runDatatypeTests = pm.collectionVariables.get("runDatatypeTests");              
                        var runFunctionalTests = pm.collectionVariables.get("runFunctionalTests");          

                        // 🧩 ~~ Generic Uptime Tests ~~ 🧩
                        pm.test("[SERVICE] [ENDPOINT] - Status code is [CODE]", function () {
                            pm.response.to.have.status([CODE]);
                        });

                        pm.test("[SERVICE] [ENDPOINT] - Response status is [RESPONSE_STATUS]", function () {
                            pm.expect(pm.response.status).to.eql("[RESPONSE_STATUS]");
                        });

                        // Conditional check for further testing
                        if (pm.response.code === [CODE]) 
                        {
                            // 🧩 ~~ Variable Declarations ~~ 🧩
                            var jsonData = pm.response.json();
                          
                            if(runBaselineTests)
                            {
                                // 🧩 ~~ Field Definition Tests ~~ 🧩
                                if(runFieldDefintionTests)
                                {
                                    // field presence tests go here
                                }

                                // 🧩 ~~ Datatype Tests ~~ 🧩
                                if (runDatatypeTests)
                                {
                                    // datatype tests go here
                                }

                                // 🧩 ~~ Functional Tests ~~ 🧩
                                if (runFunctionalTests)
                                {
                                    // functional tests go here
                                }
                            }
                            
                            console.log(pm.info.requestName + " : PASS");
                        } 
                        else 
                        {
                            console.log(pm.info.requestName + " : FAIL");
                            console.log(pm.response.text());
                        }

                        Now generate a full Postman test script by:
                        1) Replacing [SERVICE] with "${serviceName}"
                        2) Replacing [ENDPOINT] with "${endpointName}"
                        3) Replacing [METHOD] with "${method}"
                        4) Replacing [CODE] with ${expectedResponseCode}
                        4) Replacing [RESPONSE_STATUS] with "${expectedResponseStatus}"
                        5) Where appropriate, add field-presence tests and datatype tests using the provided response body schema.
                        6) Functional tests:
                            - If body contains fields like "message", "status", "success", "code", "errors", "items", "id", etc.
                              → generate meaningful functional tests.
                            - Check expected values when possible (e.g. success === true, message === "Created successfully")
                            - Check arrays contain at least one item if reasonable.
                            - Check enums (e.g. status: "ACTIVE" or "DISABLED")
                            - Check numeric ranges when obvious (e.g. amount > 0)
                            - If no functional tests can be inferred → return an empty functional block (but keep placeholder comment).
                        
                        Expected Response Body:
                        ${expectedResponseBody ? JSON.stringify(expectedResponseBody, null, 2) : "No JSON body provided"}

                        Rules:
                        - Provide field presence tests when schema has fields.
                        - For each field in schema, generate:
                          - a presence test: pm.expect(jsonData).to.have.property("field")
                          - a datatype test that checks typeof / Array.isArray where appropriate
                          - for arrays, add a test that array.length >= 0 (or >0 if reasonable)
                        - For boolean fields, check true/false expectations only if the field name suggests (e.g. 'success' -> expect true).
                        - If schema is null or empty, produce placeholder field tests (commented) so user knows where to add them.
                        - Output must be a single JavaScript code block (no surrounding triple backticks) ready to paste into Postman's Tests tab.
                        `;

    // Call OpenAI
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: "You generate Postman Tests scripts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1200
    });

    // Extract text (adjust depending on client response format)
    const text = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content
      ? response.choices[0].message.content
      : (response.output_text || "");

    res.json({ result: text });
  } catch (err) {
    console.error("❌ Error generating API tests:", err);
    res.status(500).json({ error: "Postman test generation failed." });
  }
});



// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅  AI Tester backend running at http://localhost:${PORT}`);
});
