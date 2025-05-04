'use client'
import React from 'react';

const DocPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">CircuitsAI</span>
            </a>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="/docs" className="text-primary font-semibold">Documentation</a>
              <a href="/full-adder" className="text-muted-foreground hover:text-foreground transition-colors">Examples</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://github.com/tilk/digitaljs" target="_blank" rel="noopener noreferrer" 
               className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border overflow-y-auto h-[calc(100vh-56px)] sticky top-[56px]">
          <div className="p-6">
            <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
              Table of Contents
            </h3>
            <ul className="space-y-1">
              <li>
                <a href="#overview" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Overview
                </a>
              </li>
              <li>
                <a href="#usage" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Usage
                </a>
              </li>
              <li>
                <a href="#input-format" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Input Format
                </a>
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <a href="#full-adder-example" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Full Adder Example
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#device-types" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Device Types
                </a>
                <ul className="ml-4 space-y-1 mt-1">
                  <li>
                    <a href="#logic-gates" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Logic Gates
                    </a>
                  </li>
                  <li>
                    <a href="#arithmetic-comparison" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Arithmetic & Comparison
                    </a>
                  </li>
                  <li>
                    <a href="#multiplexers" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Multiplexers
                    </a>
                  </li>
                  <li>
                    <a href="#memory-elements" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Memory Elements
                    </a>
                  </li>
                  <li>
                    <a href="#io-elements" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      I/O Elements
                    </a>
                  </li>
                  <li>
                    <a href="#bus-operations" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Bus Operations
                    </a>
                  </li>
                  <li>
                    <a href="#finite-state-machines" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                      Finite State Machines
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Related Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://digitaljs.tilk.eu/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary flex items-center"
                  >
                    <span>DigitalJS Demo</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/tilk/digitaljs" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary flex items-center"
                  >
                    <span>GitHub Repository</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75-.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a 
                    href="/full-adder" 
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    Full Adder Example
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 md:p-10 pb-20">
          <div className="container mx-auto max-w-3xl">
            <article className="prose dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-code:text-primary prose-a:text-primary max-w-none">
              <h2 id="overview" className="text-3xl font-bold my-8 border-b pb-4">Overview</h2>
              
              <p>DigitalJS is a digital circuit simulator implemented in JavaScript. It is designed to simulate circuits synthesized by hardware design tools like <a href="https://github.com/YosysHQ/yosys" target="_blank" rel="noopener noreferrer">Yosys</a>, and it has a companion project <code>yosys2digitaljs</code>, which converts Yosys output files to DigitalJS.</p>
              
              <p>It is also intended to be a teaching tool, therefore readability and ease of inspection is one of top concerns for the project.</p>
              
              <p>You can try it out <a href="https://digitaljs.tilk.eu/" target="_blank" rel="noopener noreferrer">online</a>. The web app is a separate <a href="https://github.com/tilk/digitaljs_online" target="_blank" rel="noopener noreferrer">Github project</a>.</p>
              
              <h2 id="usage" className="text-3xl font-bold my-8 border-b pb-4">Usage</h2>
              
              <p>You can use DigitalJS in your project by installing it from NPM:</p>
              
              <pre><code className="language-bash">npm install digitaljs</code></pre>
              
              <p>Or you can use the Webpack bundle directly.</p>
              
              <p>To simulate a circuit represented using the JSON input format (described later) and display it on a div named <code>#paper</code>, you need to run the following JS code (see <a href="https://digitaljs.tilk.eu/" target="_blank" rel="noopener noreferrer">running example</a>):</p>
              
              <pre><code className="language-javascript">{`// create the simulation object
const circuit = new digitaljs.Circuit(input_goes_here);
// display on #paper
const paper = circuit.displayOn($('#paper'));
// activate real-time simulation
circuit.start();`}</code></pre>
              
              <h2 id="input-format" className="text-3xl font-bold my-8 border-b pb-4">Input Format</h2>
              
              <p>Circuits are represented using JSON. The top-level object has three keys, <code>devices</code>, <code>connectors</code> and <code>subcircuits</code>.</p>
              
              <ul>
                <li>Under <code>devices</code> is a list of all devices forming the circuit, represented as an object, where keys are (unique and internal) device names.</li>
                <li>Each device has a number of properties, which are represented by an object.</li>
                <li>A mandatory property is <code>type</code>, which specifies the type of the device.</li>
              </ul>
              
              <p>Example device:</p>
              
              <pre><code className="language-json">{`"dev1": {
    "type": "And",
    "label": "AND1"
}`}</code></pre>
              
              <p>Under <code>connectors</code> is a list of connections between device ports, represented as an array of objects with two keys, <code>from</code> and <code>to</code>. Both keys map to an object with two keys, <code>id</code> and <code>port</code>; the first corresponds to a device name, and the second -- to a valid port name for the device. A connection must lead from an output port to an input port, and the bitwidth of both ports must be equal.</p>
              
              <p>Example connection:</p>
              
              <pre><code className="language-json">{`{
    "from": {
        "id": "dev1",
        "port": "out"
    },
    "to": {
        "id": "dev2",
        "port": "in"
    }
}`}</code></pre>
              
              <p>Under <code>subcircuits</code> is a list of subcircuit definitions, represented as an object, where keys are unique subcircuit names. A subcircuit name can be used as a <code>celltype</code> for a device of type <code>Subcircuit</code>; this instantiates the subcircuit. A subcircuit definition follows the representation of whole circuits, with the exception that subcircuits cannot (currently) define their own subcircuits. A subcircuit can include <code>Input</code> and <code>Output</code> devices, these are mapped to ports on a subcircuit instance.</p>
              
              <h3 id="full-adder-example" className="text-2xl font-bold my-6">Full Adder Example</h3>
              
              <p>Here's how a simple Full Adder might be represented in the digitaljs JSON format:</p>
              
              <pre><code className="language-json">{`{
  "devices": {
    "A": { "type": "Button", "label": "A" },
    "B": { "type": "Button", "label": "B" },
    "Cin": { "type": "Button", "label": "Cin" },
    "XOR1": { "type": "Xor" },
    "XOR2": { "type": "Xor" },
    "AND1": { "type": "And" },
    "AND2": { "type": "And" },
    "OR1": { "type": "Or" },
    "Sum": { "type": "Lamp", "label": "Sum" },
    "Cout": { "type": "Lamp", "label": "Cout" }
  },
  "connectors": [
    { "from": { "id": "A", "port": "out" }, "to": { "id": "XOR1", "port": "in1" } },
    { "from": { "id": "B", "port": "out" }, "to": { "id": "XOR1", "port": "in2" } },
    { "from": { "id": "XOR1", "port": "out" }, "to": { "id": "XOR2", "port": "in1" } },
    { "from": { "id": "Cin", "port": "out" }, "to": { "id": "XOR2", "port": "in2" } },
    { "from": { "id": "XOR2", "port": "out" }, "to": { "id": "Sum", "port": "in" } },
    { "from": { "id": "Cin", "port": "out" }, "to": { "id": "AND1", "port": "in1" } },
    { "from": { "id": "XOR1", "port": "out" }, "to": { "id": "AND1", "port": "in2" } },
    { "from": { "id": "A", "port": "out" }, "to": { "id": "AND2", "port": "in1" } },
    { "from": { "id": "B", "port": "out" }, "to": { "id": "AND2", "port": "in2" } },
    { "from": { "id": "AND1", "port": "out" }, "to": { "id": "OR1", "port": "in1" } },
    { "from": { "id": "AND2", "port": "out" }, "to": { "id": "OR1", "port": "in2" } },
    { "from": { "id": "OR1", "port": "out" }, "to": { "id": "Cout", "port": "in" } }
  ]
}`}</code></pre>
              
              <h2 id="device-types" className="text-3xl font-bold my-8 border-b pb-4">Device Types</h2>
              
              <div className="space-y-8">
                <div id="logic-gates" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Logic Gates</h3>
                  <h4 className="font-medium mb-2">Unary gates: <code>Not</code>, <code>Repeater</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number)</li>
                    <li><strong>Inputs:</strong> in (bits-bit)</li>
                    <li><strong>Outputs:</strong> out (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">N-ary gates: <code>And</code>, <code>Nand</code>, <code>Or</code>, <code>Nor</code>, <code>Xor</code>, <code>Xnor</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number), inputs (natural number, default 2)</li>
                    <li><strong>Inputs:</strong> in1, in2 ... inN (bits-bit, N = inputs)</li>
                    <li><strong>Outputs:</strong> out (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Reducing gates: <code>AndReduce</code>, <code>NandReduce</code>, <code>OrReduce</code>, <code>NorReduce</code>, <code>XorReduce</code>, <code>XnorReduce</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number)</li>
                    <li><strong>Inputs:</strong> in (bits-bit)</li>
                    <li><strong>Outputs:</strong> out (1-bit)</li>
                  </ul>
                </div>
                
                <div id="arithmetic-comparison" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Arithmetic & Comparison</h3>
                  
                  <h4 className="font-medium mb-2">Bit shifts: <code>ShiftLeft</code>, <code>ShiftRight</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in1, bits.in2 and bits.out (natural number), signed.in1, signed.in2, signed.out and fillx (boolean)</li>
                    <li><strong>Inputs:</strong> in1 (bits.in1-bit), in2 (bits.in2-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.out-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Comparisons: <code>Eq</code>, <code>Ne</code>, <code>Lt</code>, <code>Le</code>, <code>Gt</code>, <code>Ge</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in1 and bits.in2 (natural number), signed.in1 and signed.in2 (boolean)</li>
                    <li><strong>Inputs:</strong> in1 (bits.in1-bit), in2 (bits.in2-bit)</li>
                    <li><strong>Outputs:</strong> out (1-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Number constant: <code>Constant</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> constant (binary string)</li>
                    <li><strong>Outputs:</strong> out (constant.length-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Unary arithmetic: <code>Negation</code>, <code>UnaryPlus</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in and bits.out (natural number), signed (boolean)</li>
                    <li><strong>Inputs:</strong> in (bits.in-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.out-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Binary arithmetic: <code>Addition</code>, <code>Subtraction</code>, <code>Multiplication</code>, <code>Division</code>, <code>Modulo</code>, <code>Power</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in1, bits.in2 and bits.out (natural number), signed.in1 and signed.in2 (boolean)</li>
                    <li><strong>Inputs:</strong> in1 (bits.in1-bit), in2 (bits.in2-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.out-bit)</li>
                  </ul>
                </div>
                
                <div id="multiplexers" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Multiplexers</h3>
                  
                  <h4 className="font-medium mb-2">Multiplexer: <code>Mux</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in, bits.sel (natural number)</li>
                    <li><strong>Inputs:</strong> in0 ... inN (bits.in-bit, N = 2**bits.sel-1), sel (bits.sel-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.in-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">One-hot multiplexer: <code>Mux1Hot</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in, bits.sel (natural number)</li>
                    <li><strong>Inputs:</strong> in0 ... inN (bits.in-bit, N = bits.sel), sel (bits.sel-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.in-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Sparse multiplexer: <code>MuxSparse</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in, bits.sel (natural number), inputs (list of natural numbers), default_input (optional boolean)</li>
                    <li><strong>Inputs:</strong> in0 ... inN (bits.in-bit, N = inputs.length, +1 if default_input is true)</li>
                    <li><strong>Outputs:</strong> out (bits.in-bit)</li>
                  </ul>
                </div>
                
                <div id="memory-elements" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Memory Elements</h3>
                  
                  <h4 className="font-medium mb-2">D flip-flop: <code>Dff</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number), polarity.clock, polarity.arst, polarity.srst, polarity.aload, polarity.set, polarity.clr, polarity.enable, enable_srst (optional booleans), initial (optional binary string), arst_value, srst_value (optional binary string), no_data (optional boolean)</li>
                    <li><strong>Inputs:</strong> in (bits-bit), clk (1-bit, if polarity.clock is present), arst (1-bit, if polarity.arst is present), srst (1-bit, if polarity.srst is present), en (1-bit, if polarity.enable is present), set (1-bit, if polarity.set is present), clr (1-bit, if polarity.clr is present), ain (bits-bit, if polarity.aload is present), aload (1-bit, if polarity.aload is present)</li>
                    <li><strong>Outputs:</strong> out (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Memory: <code>Memory</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits, abits, words, offset (natural number), rdports (array of read port descriptors), wrports (array of write port descriptors), memdata (memory contents description)</li>
                    <li><strong>Read port descriptor attributes:</strong> enable_polarity, clock_polarity, arst_polarity, srst_polarity (optional booleans), init_value, arst_value, srst_value (optional binary strings), transparent, collision (optional booleans or arrays of booleans)</li>
                    <li><strong>Write port descriptor attributes:</strong> enable_polarity, clock_polarity, no_bit_enable (optional booleans)</li>
                    <li><strong>Inputs (per read port):</strong> rdKaddr (abits-bit), rdKen (1-bit, if enable_polarity is present), rdKclk (1-bit, if clock_polarity is present), rdKarst (1-bit, if arst_polarity is present), rdKsrst (1-bit, if srst_polarity is present)</li>
                    <li><strong>Outputs (per read port):</strong> rdKdata (bits-bit)</li>
                    <li><strong>Inputs (per write port):</strong> wrKaddr (abits-bit), wrKdata (bits-bit), wrKen (1-bit (when no_bit_enable is true) or bits-bit (otherwise), if enable_polarity is present), wrKclk (1-bit, if clock_polarity is present)</li>
                  </ul>
                </div>
                
                <div id="io-elements" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">I/O Elements</h3>
                  
                  <h4 className="font-medium mb-2">Clock source: <code>Clock</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Outputs:</strong> out (1-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Button input: <code>Button</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Outputs:</strong> out (1-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Lamp output: <code>Lamp</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Inputs:</strong> in (1-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Number input: <code>NumEntry</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number), numbase (string)</li>
                    <li><strong>Outputs:</strong> out (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Number output: <code>NumDisplay</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number), numbase (string)</li>
                    <li><strong>Inputs:</strong> in (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Subcircuit input: <code>Input</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number)</li>
                    <li><strong>Outputs:</strong> out (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Subcircuit output: <code>Output</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits (natural number)</li>
                    <li><strong>Inputs:</strong> in (bits-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">7 segment display output: <code>Display7</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Inputs:</strong> bits (8-bit only - most significant bit controls decimal point LED)</li>
                  </ul>
                </div>
                
                <div id="bus-operations" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Bus Operations</h3>
                  
                  <h4 className="font-medium mb-2">Bus grouping: <code>BusGroup</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> groups (array of natural numbers)</li>
                    <li><strong>Inputs:</strong> in0 (groups[0]-bit) ... inN (groups[N]-bit)</li>
                    <li><strong>Outputs:</strong> out (sum-of-groups-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Bus ungrouping: <code>BusUngroup</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> groups (array of natural numbers)</li>
                    <li><strong>Inputs:</strong> in (sum-of-groups-bit)</li>
                    <li><strong>Outputs:</strong> out0 (groups[0]-bit) ... outN (groups[N]-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Bus slicing: <code>BusSlice</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> slice.first, slice.count, slice.total (natural number)</li>
                    <li><strong>Inputs:</strong> in (slice.total-bit)</li>
                    <li><strong>Outputs:</strong> out (slice.count-bit)</li>
                  </ul>
                  
                  <h4 className="font-medium mt-4 mb-2">Zero- and sign-extension: <code>ZeroExtend</code>, <code>SignExtend</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> extend.input, extend.output (natural number)</li>
                    <li><strong>Inputs:</strong> in (extend.input-bit)</li>
                    <li><strong>Outputs:</strong> out (extend.output-bit)</li>
                  </ul>
                </div>
                
                <div id="finite-state-machines" className="rounded-lg border border-border p-6 bg-card">
                  <h3 className="text-xl font-semibold mb-3">Finite State Machines</h3>
                  
                  <h4 className="font-medium mb-2">FSM: <code>FSM</code></h4>
                  <ul className="list-disc ml-5 space-y-1">
                    <li><strong>Attributes:</strong> bits.in, bits.out, states, init_state, current_state (natural number), trans_table (array of transition descriptors)</li>
                    <li><strong>Transition descriptor attributes:</strong> ctrl_in, ctrl_out (binary strings), state_in, state_out (natural numbers)</li>
                    <li><strong>Inputs:</strong> clk (1-bit), arst (1-bit), in (bits.in-bit)</li>
                    <li><strong>Outputs:</strong> out (bits.out-bit)</li>
                  </ul>
                </div>
              </div>
            </article>
            
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Documentation for <a href="https://github.com/tilk/digitaljs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">DigitalJS</a>
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Created by <a href="https://github.com/KshKnsl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kush Kansal</a></span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Use client-side JavaScript to make the anchor links work with proper scrolling behavior
const useScrollSpy = () => {
  React.useEffect(() => {
    // Fix anchor links scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          const yOffset = -100; // Adjust this value based on your header height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          
          // Update URL without scrolling
          history.pushState(null, '', target.getAttribute('href'));
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Handle initial hash in URL
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};

const DocPageWithScrollSpy = () => {
  useScrollSpy();
  return <DocPage />;
};

export default DocPageWithScrollSpy;
