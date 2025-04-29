"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Script from "next/script";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const FullAdderPage = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<any>(null);
  const papersRef = useRef<Record<string, any>>({});

  const [isFixed, setIsFixed] = useState(false);
  const [includeLayout, setIncludeLayout] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const initialCircuitJson = useMemo(
    () => ({
      devices: {
        dev0: { type: "Button", label: "a", net: "a", order: 0, bits: 1 },
        dev1: { type: "Button", label: "b", net: "b", order: 1, bits: 1 },
        dev2: { type: "Button", label: "d", net: "d", order: 2, bits: 1 },
        dev3: { type: "Lamp", label: "o", net: "o", order: 3, bits: 1 },
        dev4: { type: "Lamp", label: "c", net: "c", order: 4, bits: 1 },
        dev5: { type: "Or", label: "or", bits: 1 },
        dev6: { type: "Subcircuit", label: "ha1", celltype: "halfadder" },
        dev7: { type: "Subcircuit", label: "ha2", celltype: "halfadder" },
      },
      connectors: [
        {
          to: { id: "dev6", port: "a" },
          from: { id: "dev0", port: "out" },
          name: "a",
        },
        {
          to: { id: "dev6", port: "b" },
          from: { id: "dev1", port: "out" },
          name: "b",
        },
        {
          to: { id: "dev7", port: "b" },
          from: { id: "dev2", port: "out" },
          name: "d",
        },
        {
          to: { id: "dev3", port: "in" },
          from: { id: "dev7", port: "o" },
          name: "o",
        },
        {
          to: { id: "dev4", port: "in" },
          from: { id: "dev5", port: "out" },
          name: "c",
        },
        {
          to: { id: "dev5", port: "in1" },
          from: { id: "dev6", port: "c" },
          name: "c1",
        },
        {
          to: { id: "dev5", port: "in2" },
          from: { id: "dev7", port: "c" },
          name: "c2",
        },
        {
          to: { id: "dev7", port: "a" },
          from: { id: "dev6", port: "o" },
          name: "t",
        },
      ],
      subcircuits: {
        halfadder: {
          devices: {
            dev0: { type: "Input", label: "a", net: "a", order: 0, bits: 1 },
            dev1: { type: "Input", label: "b", net: "b", order: 1, bits: 1 },
            dev2: { type: "Output", label: "o", net: "o", order: 2, bits: 1 },
            dev3: { type: "Output", label: "c", net: "c", order: 3, bits: 1 },
            dev4: {
              label: "$and$tests/fulladder.sv:10$2",
              type: "And",
              bits: 1,
            },
            dev5: {
              label: "$xor$tests/fulladder.sv:9$1",
              type: "Xor",
              bits: 1,
            },
          },
          connectors: [
            {
              to: { id: "dev4", port: "in1" },
              from: { id: "dev0", port: "out" },
              name: "a",
            },
            {
              to: { id: "dev5", port: "in1" },
              from: { id: "dev0", port: "out" },
              name: "a",
            },
            {
              to: { id: "dev4", port: "in2" },
              from: { id: "dev1", port: "out" },
              name: "b",
            },
            {
              to: { id: "dev5", port: "in2" },
              from: { id: "dev1", port: "out" },
              name: "b",
            },
            {
              to: { id: "dev2", port: "in" },
              from: { id: "dev5", port: "out" },
              name: "o",
            },
            {
              to: { id: "dev3", port: "in" },
              from: { id: "dev4", port: "out" },
              name: "c",
            },
          ],
        },
      },
    }),
    []
  );

  const applyFixedMode = (fixed: boolean) => {
    Object.values(papersRef.current).forEach((p: any) => p?.fixed?.(fixed));
  };

  const loadCircuit = useCallback(
    (json: object) => {
      if (typeof window === "undefined" || !(window as any).digitaljs) {
        console.error("digitaljs library is not loaded or ready.");
        return;
      }
      const digitaljs = (window as any).digitaljs;

      if (circuitRef.current) {
        circuitRef.current.stop();
      }
      papersRef.current = {};
      if (paperRef.current) paperRef.current.innerHTML = "";

      try {
        const circuit = new digitaljs.Circuit(json);
        circuitRef.current = circuit;

        circuit.on("new:paper", (paper: any) => {
          paper.fixed(isFixed);
          papersRef.current[paper.cid] = paper;
          paper.on("element:pointerdblclick", (cellView: any) => {
            (window as any).digitaljsCell = cellView.model;
            console.info(
              "You can now access the doubly clicked gate as digitaljsCell in your WebBrowser console!"
            );
          });
        });

        circuit.on("remove:paper", (paper: any) => {
          delete papersRef.current[paper.cid];
        });

        if (paperRef.current) {
          circuit.displayOn(paperRef.current);
          applyFixedMode(isFixed);
        }

        circuit.start();
      } catch (error) {
        console.error("Error loading/initializing digitaljs circuit:", error);
      }
    },
    [isFixed]
  );

  useEffect(() => {
    if (scriptLoaded) {
      loadCircuit(initialCircuitJson);
    }
    return () => {
      if (circuitRef.current) {
        circuitRef.current.stop();
      }
    };
  }, [scriptLoaded, initialCircuitJson, loadCircuit]);

  useEffect(() => {
    if (scriptLoaded) {
      loadCircuit(initialCircuitJson);
    }
  }, [initialCircuitJson, scriptLoaded, loadCircuit]);

  const handleFixedChange = (checked: boolean | "indeterminate") => {
    const newChecked = !!checked;
    setIsFixed(newChecked);
    applyFixedMode(newChecked);
  };

  const handleLayoutChange = (checked: boolean | "indeterminate") => {
    setIncludeLayout(!!checked);
  };

  const handleSerializeReload = () => {
    if (!circuitRef.current) return;
    const json = circuitRef.current.toJSON(includeLayout);
    console.log("Serialized JSON:", json);
    loadCircuit(json);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">CircuitAi</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <Link href="/full-adder" className="text-primary font-semibold">
                Examples
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
       
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Circuit Visualization
          </h2>
          <p className="text-muted-foreground mb-6">
            Click on the input buttons (a, b, d) to toggle their states
            and observe how the outputs change. Double-click on components
            to inspect them in the browser console.
          </p>

          <Script
            src="/digital.js"
            strategy="lazyOnload"
            onLoad={() => {
              console.log("digitaljs script loaded.");
              setScriptLoaded(true);
            }}
            onError={(e) => {
              console.error("Error loading digitaljs script:", e);
            }}
          />

          <div
            ref={paperRef}
            id="paper"
            className="max-h-[400px] border border-border w-full box-border bg-white rounded shadow-sm"
          ></div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center mt-4">
            <div className="flex items-center space-x-2 p-2 border rounded border-border sm:p-2">
              <Checkbox
                id="fixed-mode"
                checked={isFixed}
                onCheckedChange={handleFixedChange}
              />
              <Label htmlFor="fixed-mode" className="cursor-pointer">
                Fixed Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 border rounded border-border sm:p-2">
              <Checkbox
                id="include-layout"
                checked={includeLayout}
                onCheckedChange={handleLayoutChange}
              />
              <Label htmlFor="include-layout" className="cursor-pointer">
                Include layout
              </Label>
            </div>
            <button
              onClick={handleSerializeReload}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors ml-auto"
            >
              Serialize & Reload
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Circuit JSON Representation
          </h2>
          <p className="mb-6 text-muted-foreground">
            This is the JSON circuit definition that DigitalJS uses to render
            and simulate the full adder:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Devices</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-[300px] overflow-y-auto">
                <code>{JSON.stringify(initialCircuitJson.devices, null, 2)}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Connectors</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-[300px] overflow-y-auto">
                <code>{JSON.stringify(initialCircuitJson.connectors, null, 2)}</code>
              </pre>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Subcircuits</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm max-h-[400px] overflow-y-auto">
                <code>{JSON.stringify(initialCircuitJson.subcircuits, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullAdderPage;
