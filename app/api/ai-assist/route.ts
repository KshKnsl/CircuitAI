import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { circuit } = await request.json();
        const prompt = `Analyze the following logic circuit JSON and suggest improvements or fixes if any issues are identified:\n\n${circuit}`;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set.");
            return NextResponse.json({ result: "API key not configured." }, { status: 500 });
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        contents: [{
                                parts: [{
                                        text: prompt
                                }]
                        }]
                })
        });

        if (!response.ok) {
                const errorBody = await response.text();
                console.error(`Error calling Gemini API: ${response.status} ${response.statusText}`, errorBody);
                return NextResponse.json({ result: `Error from AI service: ${response.statusText}` }, { status: response.status });
        }

        const jsonResponse = await response.json();
        // console.log(JSON.stringify(jsonResponse, null, 2)); // Optional: Log the full response for debugging

        // Extract the text from the response, structure might vary based on the API version and response content.
        // Adjust this path based on the actual structure of jsonResponse.
        const generatedText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

        return NextResponse.json({ result: generatedText || "No suggestions returned." });
    } catch (error) {
        console.error("Error calling Gemini AI API:", error);
        // Check if the error is an instance of Error to access the message property safely
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ result: `Error processing request: ${errorMessage}` }, { status: 500 });
    }
}
