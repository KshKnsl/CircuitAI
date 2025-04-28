import { NextResponse } from "next/server";

// Define expected structure from Gemini
const JSON_MARKER_START = "```json";
const JSON_MARKER_END = "```";
const EXPLANATION_MARKER = "--- Explanation ---";

export async function POST(request: Request) {
    try {
        const { prompt: userPrompt } = await request.json();

        if (!userPrompt) {
            return NextResponse.json(
                { error: "Prompt is required." },
                { status: 400 }
            );
        }

        // Refined prompt for Gemini with detailed structure example
        const generationPrompt = `You are an expert in digital logic circuits and the digitaljs library format. Generate a digitaljs circuit JSON object based on the following user request.

**Instructions:**
1.  Analyze the user's request carefully.
2.  Create the corresponding circuit definition in the digitaljs JSON format.
3.  The JSON object **MUST** have a top-level structure containing 'devices' (object) and 'connectors' (array). It **MAY** also contain 'subcircuits' (object) if needed.
4.  **Devices Object:** Keys are unique device IDs (e.g., "dev0", "dev1"). Values are objects with properties like 'type' (string, e.g., 'Button', 'Lamp', 'And', 'Or', 'Xor', 'Not', 'Input', 'Output', 'Subcircuit'), 'label' (string), 'net' (string, optional), 'order' (number, optional), 'bits' (number, usually 1), 'celltype' (string, required for 'Subcircuit' type).
5.  **Connectors Array:** Each element is an object defining a wire connection. It **MUST** have 'to' (object with 'id' and 'port' strings) and 'from' (object with 'id' and 'port' strings). It **MAY** have a 'name' (string).
6.  **Subcircuits Object (Optional):** Keys are subcircuit names (e.g., "halfadder"). Values are objects defining the subcircuit structure, containing their own 'devices' and 'connectors' following the same rules.
7.  **Output Format:** Your response **MUST** strictly follow this structure:
    *   First, provide the raw digitaljs JSON object enclosed in triple backticks with the language specifier \`json\`. Start the block immediately with \`\`\`json. Do not add any text before this block.
    *   After the JSON block, add a separator line exactly like this: \n${EXPLANATION_MARKER}\n
    *   Finally, provide a brief explanation of the generated circuit or any relevant notes. Do not add any text after the explanation.

**Example of a Valid Full Adder JSON Structure:**

${JSON_MARKER_START}
{
  "devices": {
    "dev0": { "type": "Button", "label": "a", "net": "a", "order": 0, "bits": 1 },
    "dev1": { "type": "Button", "label": "b", "net": "b", "order": 1, "bits": 1 },
    "dev2": { "type": "Button", "label": "cin", "net": "cin", "order": 2, "bits": 1 },
    "dev3": { "type": "Lamp", "label": "s", "net": "s", "order": 3, "bits": 1 },
    "dev4": { "type": "Lamp", "label": "cout", "net": "cout", "order": 4, "bits": 1 },
    "dev5": { "type": "Or", "label": "or1", "bits": 1 },
    "dev6": { "type": "Subcircuit", "label": "ha1", "celltype": "halfadder" },
    "dev7": { "type": "Subcircuit", "label": "ha2", "celltype": "halfadder" }
  },
  "connectors": [
    { "to": { "id": "dev6", "port": "a" }, "from": { "id": "dev0", "port": "out" }, "name": "a" },
    { "to": { "id": "dev6", "port": "b" }, "from": { "id": "dev1", "port": "out" }, "name": "b" },
    { "to": { "id": "dev7", "port": "b" }, "from": { "id": "dev2", "port": "out" }, "name": "cin" },
    { "to": { "id": "dev3", "port": "in" }, "from": { "id": "dev7", "port": "o" }, "name": "s" },
    { "to": { "id": "dev4", "port": "in" }, "from": { "id": "dev5", "port": "out" }, "name": "cout" },
    { "to": { "id": "dev5", "port": "in1" }, "from": { "id": "dev6", "port": "c" }, "name": "c1" },
    { "to": { "id": "dev5", "port": "in2" }, "from": { "id": "dev7", "port": "c" }, "name": "c2" },
    { "to": { "id": "dev7", "port": "a" }, "from": { "id": "dev6", "port": "o" }, "name": "t" }
  ],
  "subcircuits": {
    "halfadder": {
      "devices": {
        "dev0": { "type": "Input", "label": "a", "net": "a", "order": 0, "bits": 1 },
        "dev1": { "type": "Input", "label": "b", "net": "b", "order": 1, "bits": 1 },
        "dev2": { "type": "Output", "label": "o", "net": "o", "order": 2, "bits": 1 },
        "dev3": { "type": "Output", "label": "c", "net": "c", "order": 3, "bits": 1 },
        "dev4": { "type": "And", "label": "and1", "bits": 1 },
        "dev5": { "type": "Xor", "label": "xor1", "bits": 1 }
      },
      "connectors": [
        { "to": { "id": "dev4", "port": "in1" }, "from": { "id": "dev0", "port": "out" }, "name": "a_to_and" },
        { "to": { "id": "dev5", "port": "in1" }, "from": { "id": "dev0", "port": "out" }, "name": "a_to_xor" },
        { "to": { "id": "dev4", "port": "in2" }, "from": { "id": "dev1", "port": "out" }, "name": "b_to_and" },
        { "to": { "id": "dev5", "port": "in2" }, "from": { "id": "dev1", "port": "out" }, "name": "b_to_xor" },
        { "to": { "id": "dev2", "port": "in" }, "from": { "id": "dev5", "port": "out" }, "name": "o" },
        { "to": { "id": "dev3", "port": "in" }, "from": { "id": "dev4", "port": "out" }, "name": "c" }
      ]
    }
  }
}
${JSON_MARKER_END}
${EXPLANATION_MARKER}
This is a full adder circuit constructed using two half adder subcircuits...

**User Request:** "${userPrompt}"

**Generate the response now:**`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set.");
            return NextResponse.json(
                { error: "API key not configured." },
                { status: 500 }
            );
        }
        console.log("GEMINI_API_KEY is set."); // Don't log the key itself in production
        // Updated URL based on user request
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`; // Using 1.5-flash as 2.0-flash might not be available or intended

        let response: Response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: generationPrompt }] }],
                    // Optional: Add generationConfig if needed
                    // generationConfig: {
                    //   temperature: 0.7,
                    //   topK: 1,
                    //   topP: 1,
                    //   maxOutputTokens: 2048,
                    // },
                    // Optional: Add safetySettings if needed
                    // safetySettings: [
                    //   { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    //   // ... other categories
                    // ],
                }),
            });
        } catch (fetchError: any) {
            // Catch network errors during fetch itself
            console.error("Network error fetching Gemini API:", fetchError);
            return NextResponse.json(
                { error: "Network error connecting to AI service.", details: fetchError.message },
                { status: 503 }
            ); // Service Unavailable
        }

        if (!response.ok) {
            // Log status and attempt to read error body for more details
            const errorStatus = response.status;
            let errorBody = await response.text().catch(() => "Could not read error body."); // Read body safely
            console.error(`Gemini API request failed with status ${errorStatus}. Body:`, errorBody);
            // Return a more informative error
            return NextResponse.json(
                { error: `Gemini API request failed with status ${errorStatus}.`, details: errorBody },
                { status: errorStatus }
            );
        }

        const data = await response.json();
        // Log the received data structure
        console.log("Gemini API Response Data:", JSON.stringify(data, null, 2));

        // Improved access to generated text, handling potential variations
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            console.error("No generated text found in Gemini response:", JSON.stringify(data, null, 2)); // Log the full response structure for debugging
            return NextResponse.json(
                { error: "No content generated by AI." },
                { status: 500 }
            );
        }
        // Log the extracted text content
        console.log("Generated Text:", generatedText);


        // Parse the response based on markers
        let circuitJsonString = null;
        let explanation =
            "AI did not provide an explanation in the expected format.";

        const jsonStartIndex = generatedText.indexOf(JSON_MARKER_START);
        const jsonEndIndex = generatedText.indexOf(
            JSON_MARKER_END,
            jsonStartIndex + JSON_MARKER_START.length
        );
        const explanationIndex = generatedText.indexOf(EXPLANATION_MARKER);

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            circuitJsonString = generatedText
                .substring(jsonStartIndex + JSON_MARKER_START.length, jsonEndIndex)
                .trim();
        }

        if (explanationIndex !== -1) {
            explanation = generatedText
                .substring(explanationIndex + EXPLANATION_MARKER.length)
                .trim();
        } else if (jsonEndIndex !== -1 && explanationIndex === -1) {
            // If explanation marker is missing, take text after JSON block
            explanation = generatedText
                .substring(jsonEndIndex + JSON_MARKER_END.length)
                .trim();
            if (!explanation) explanation = "No explanation provided after JSON.";
        }

        if (!circuitJsonString) {
            console.error("Could not find JSON block in response:", generatedText);
            return NextResponse.json(
                {
                    error: "AI response did not contain a valid JSON block.",
                    details: generatedText,
                },
                { status: 500 }
            );
        }

        try {
            const circuitJson = JSON.parse(circuitJsonString);
            // Log the final parsed JSON and explanation
            console.log("Parsed Circuit JSON:", circuitJson);
            console.log("Parsed Explanation:", explanation);
            // Return both JSON and explanation
            return NextResponse.json({ circuitJson, explanation });
        } catch (parseError: any) { // Catch specific error type
            console.error("Failed to parse generated JSON:", parseError);
            console.error("Raw JSON string:", circuitJsonString);
            console.error("Full response:", generatedText);
            return NextResponse.json(
                {
                    error: "AI generated invalid JSON.",
                    details: circuitJsonString,
                    explanation: explanation, // Include explanation even if JSON fails
                    parseErrorMessage: parseError.message, // Include parse error message
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("Error in generate-circuit route:", error);
        // Provide more specific error details if available
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Internal server error.", details: errorMessage },
            { status: 500 }
        );
    }
}
