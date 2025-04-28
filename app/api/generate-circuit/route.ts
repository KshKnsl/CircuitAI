import { NextResponse } from "next/server";

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

        const generationPrompt = `You are an expert in digital logic circuits and the digitaljs library format. Generate a digitaljs circuit JSON object based on the following user request.

**Input format**
Circuits are represented using JSON. The top-level object has three keys, devices, connectors and subcircuits. Under devices is a list of all devices forming the circuit, represented as an object, where keys are (unique and internal) device names. Each device has a number of properties, which are represented by an object. A mandatory property is type, which specifies the type of the device. Example device:

\`\`\`json
"dev1": {
    "type": "And",
    "label": "AND1"
}
\`\`\`
Under connectors is a list of connections between device ports, represented as an array of objects with two keys, from and to. Both keys map to an object with two keys, id and port; the first corresponds to a device name, and the second -- to a valid port name for the device. A connection must lead from an output port to an input port, and the bitwidth of both ports must be equal. Example connection:
\`\`\`json
{
    "from": {
        "id": "dev1",
        "port": "out"
    },
    "to": {
        "id": "dev2",
        "port": "in"
    }
}
\`\`\`
Under subcircuits is a list of subcircuit definitions, represented as an object, where keys are unique subcircuit names. A subcircuit name can be used as a celltype for a device of type Subcircuit; this instantiates the subcircuit. A subcircuit definition follows the representation of whole circuits, with the exception that subcircuits cannot (currently) define their own subcircuits. A subcircuit can include Input and Output devices, these are mapped to ports on a subcircuit instance.

**Device types**
Unary gates: Not, Repeater
Attributes: bits (natural number)
Inputs: in (bits-bit)
Outputs: out (bits-bit)
N-ary gates: And, Nand, Or, Nor, Xor, Xnor
Attributes: bits (natural number), inputs (natural number, default 2)
Inputs: in1, in2 ... inN (bits-bit, N = inputs)
Outputs: out (bits-bit)
Reducing gates: AndReduce, NandReduce, OrReduce, NorReduce, XorReduce, XnorReduce
Attributes: bits (natural number)
Inputs: in (bits-bit)
Outputs: out (1-bit)
Bit shifts: ShiftLeft, ShiftRight
Attributes: bits.in1, bits.in2 and bits.out (natural number), signed.in1, signed.in2, signed.out and fillx (boolean)
Inputs: in1 (bits.in1-bit), in2 (bits.in2-bit)
Outputs: out (bits.out-bit)
Comparisons: Eq, Ne, Lt, Le, Gt, Ge
Attributes: bits.in1 and bits.in2 (natural number), signed.in1 and signed.in2 (boolean)
Inputs: in1 (bits.in1-bit), in2 (bits.in2-bit)
Outputs: out (1-bit)
Number constant: Constant
Attributes: constant (binary string)
Outputs: out (constant.length-bit)
Unary arithmetic: Negation, UnaryPlus
Attributes: bits.in and bits.out (natural number), signed (boolean)
Inputs: in (bits.in-bit)
Outputs: out (bits.out-bit)
Binary arithmetic: Addition, Subtraction, Multiplication, Division, Modulo, Power
Attributes: bits.in1, bits.in2 and bits.out (natural number), signed.in1 and signed.in2 (boolean)
Inputs: in1 (bits.in1-bit), in2 (bits.in2-bit)
Outputs: out (bits.out-bit)
Multiplexer: Mux
Attributes: bits.in, bits.sel (natural number)
Inputs: in0 ... inN (bits.in-bit, N = 2**bits.sel-1), sel (bits.sel-bit)
Outputs: out (bits.in-bit)
One-hot multiplexer: Mux1Hot
Attributes: bits.in, bits.sel (natural number)
Inputs: in0 ... inN (bits.in-bit, N = bits.sel), sel (bits.sel-bit)
Outputs: out (bits.in-bit)
Sparse multiplexer: MuxSparse
Attributes: bits.in, bits.sel (natural number), inputs (list of natural numbers), default_input (optional boolean)
Inputs: in0 ... inN (bits.in-bit, N = inputs.length, +1 if default_input is true)
Outputs: out (bits.in-bit)
D flip-flop: Dff
Attributes: bits (natural number), polarity.clock, polarity.arst, polarity.srst, polarity.aload, polarity.set, polarity.clr, polarity.enable, enable_srst (optional booleans), initial (optional binary string), arst_value, srst_value (optional binary string), no_data (optional boolean)
Inputs: in (bits-bit), clk (1-bit, if polarity.clock is present), arst (1-bit, if polarity.arst is present), srst (1-bit, if polarity.srst is present), en (1-bit, if polarity.enable is present), set (1-bit, if polarity.set is present), clr (1-bit, if polarity.clr is present), ain (bits-bit, if polarity.aload is present), aload (1-bit, if polarity.aload is present)
Outputs: out (bits-bit)
Memory: Memory
Attributes: bits, abits, words, offset (natural number), rdports (array of read port descriptors), wrports (array of write port descriptors), memdata (memory contents description)
Read port descriptor attributes: enable_polarity, clock_polarity, arst_polarity, srst_polarity (optional booleans), init_value, arst_value, srst_value (optional binary strings), transparent, collision (optional booleans or arrays of booleans)
Write port descriptor attributes: enable_polarity, clock_polarity, no_bit_enable (optional booleans)
Inputs (per read port): rdKaddr (abits-bit), rdKen (1-bit, if enable_polarity is present), rdKclk (1-bit, if clock_polarity is present), rdKarst (1-bit, if arst_polarity is present), rdKsrst (1-bit, if srst_polarity is present)
Outputs (per read port): rdKdata (bits-bit)
Inputs (per write port): wrKaddr (abits-bit), wrKdata (bits-bit), wrKen (1-bit (when no_bit_enable is true) or bits-bit (otherwise), if enable_polarity is present), wrKclk (1-bit, if clock_polarity is present)
Clock source: Clock
Outputs: out (1-bit)
Button input: Button
Outputs: out (1-bit)
Lamp output: Lamp
Inputs: in (1-bit)
Number input: NumEntry
Attributes: bits (natural number), numbase (string)
Outputs: out (bits-bit)
Number output: NumDisplay
Attributes: bits (natural number), numbase (string)
Inputs: in (bits-bit)
Subcircuit input: Input
Attributes: bits (natural number)
Outputs: out (bits-bit)
Subcircuit output: Output
Attributes: bits (natural number)
Inputs: in (bits-bit)
7 segment display output: Display7
Inputs: bits (8-bit only - most significant bit controls decimal point LED)
Bus grouping: BusGroup
Attributes: groups (array of natural numbers)
Inputs: in0 (groups[0]-bit) ... inN (groups[N]-bit)
Outputs: out (sum-of-groups-bit)
Bus ungrouping: BusUngroup
Attributes: groups (array of natural numbers)
Inputs: in (sum-of-groups-bit)
Outputs: out0 (groups[0]-bit) ... outN (groups[N]-bit)
Bus slicing: BusSlice
Attributes: slice.first, slice.count, slice.total (natural number)
Inputs: in (slice.total-bit)
Outputs: out (slice.count-bit)
Zero- and sign-extension: ZeroExtend, SignExtend
Attributes: extend.input, extend.output (natural number)
Inputs: in (extend.input-bit)
Outputs: out (extend.output-bit)
Finite state machines: FSM
Attributes: bits.in, bits.out, states, init_state, current_state (natural number), trans_table (array of transition descriptors)
Transition descriptor attributes: ctrl_in, ctrl_out (binary strings), state_in, state_out (natural numbers)
Inputs: clk (1-bit), arst (1-bit), in (bits.in-bit)
Outputs: out (bits.out-bit)

**Instructions:**
1.  Analyze the user's request carefully.
2.  If the user's request describes a valid digital logic circuit, create the corresponding circuit definition in the digitaljs JSON format.
3.  If the user's request is not related to a digital logic circuit or is a greeting, generate a dummy circuit with a single lamp that is always on. Provide a human-like response in the explanation, acknowledging the user's input or greeting.
4.  The JSON object **MUST** have a top-level structure containing 'devices' (object) and 'connectors' (array). It **MAY** also contain 'subcircuits' (object) if needed.
5.  **Devices Object:** Keys are unique device IDs (e.g., "dev0", "dev1"). Values are objects with properties like 'type' (string, e.g., 'Button', 'Lamp', 'And', 'Or', 'Xor', 'Not', 'Input', 'Output', 'Subcircuit'), 'label' (string), 'net' (string, optional), 'order' (number, optional), 'bits' (number, optional), 'celltype' (string, required for 'Subcircuit' type).
6.  **Connectors Array:** Each element is an object defining a wire connection. It **MUST** have 'to' (object with 'id' and 'port' strings) and 'from' (object with 'id' and 'port' strings). It **MAY** have a 'name' (string).
7.  **Subcircuits Object (Optional):** Keys are subcircuit names (e.g., "halfadder"). Values are objects defining the subcircuit structure, containing their own 'devices' and 'connectors' following the same rules.
8.  **Output Format:** Your response **MUST** strictly follow this structure:
    *   First, provide the raw digitaljs JSON object enclosed in triple backticks with the language specifier \`json\`. Start the block immediately with \`\`\`json. Do not add any text before this block.
    *   After the JSON block, add a separator line exactly like this: \n${EXPLANATION_MARKER}\n
    *   Finally, provide a brief explanation of the generated circuit, focusing on its functionality, the logic it implements, and how the components interact to achieve the desired behavior. Avoid describing the JSON structure itself unless it is a dummy circuit. If it is a dummy circuit, provide a human-like response. Do not add any text after the explanation.

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
        console.log("GEMINI_API_KEY is set.");
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        let response: Response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: generationPrompt }] }],
                }),
            });
        } catch (fetchError: unknown) {
            console.error("Network error fetching Gemini API:", fetchError);
            return NextResponse.json(
                { error: "Network error connecting to AI service.", details: String(fetchError) },
                { status: 503 }
            ); 
        }

        if (!response.ok) {
            const errorStatus = response.status;
            const errorBody = await response.text().catch(() => "Could not read error body.");
            console.error(`Gemini API request failed with status ${errorStatus}. Body:`, errorBody);
            return NextResponse.json(
                { error: `Gemini API request failed with status ${errorStatus}.`, details: errorBody },
                { status: errorStatus }
            );
        }

        const data = await response.json();
        console.log("Gemini API Response Data:", JSON.stringify(data, null, 2));

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            console.error("No generated text found in Gemini response:", JSON.stringify(data, null, 2)); 
            return NextResponse.json(
                { error: "No content generated by AI." },
                { status: 500 }
            );
        }
        console.log("Generated Text:", generatedText);

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
            console.log("Parsed Circuit JSON:", circuitJson);
            console.log("Parsed Explanation:", explanation);
            return NextResponse.json({ circuitJson, explanation });
        } catch (parseError: unknown) { 
            console.error("Failed to parse generated JSON:", parseError);
            console.error("Raw JSON string:", circuitJsonString);
            console.error("Full response:", generatedText);
            return NextResponse.json(
                {
                    error: "AI generated invalid JSON.",
                    details: circuitJsonString,
                    explanation: explanation,
                    parseErrorMessage: String(parseError),
                },
                { status: 500 }
            );
        }
    } catch (error: unknown) {
        console.error("Error in generate-circuit route:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Internal server error.", details: errorMessage },
            { status: 500 }
        );
    }
}
