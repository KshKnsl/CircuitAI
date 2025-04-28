"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Script from "next/script";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FullAdderPage = () => {
  const paperRef = useRef<HTMLDivElement>(null);

  const circuitRef = useRef<any>(null);
  const papersRef = useRef<Record<string, any>>({});

  const [isFixed, setIsFixed] = useState(false);
  const [includeLayout, setIncludeLayout] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const initialCircuitJson = useMemo(() => ({
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
          dev4: { label: "$and$tests/fulladder.sv:10$2", type: "And", bits: 1 },
          dev5: { label: "$xor$tests/fulladder.sv:9$1", type: "Xor", bits: 1 },
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
  }), []);

  const applyFixedMode = (fixed: boolean) => {
    Object.values(papersRef.current).forEach((p: any) => p?.fixed?.(fixed));
  };

  const loadCircuit = useCallback((json: object) => {
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
  }, [isFixed]);

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
    <div className="flex flex-col gap-4 p-4 max-w-full box-border">
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
        className="min-h-[200px] border border-gray-300 w-full box-border bg-white rounded shadow"
      ></div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
        <div className="flex items-center space-x-2 p-2 border rounded sm:border-none sm:p-0 w-full sm:w-auto">
          <Checkbox
            id="fixed-mode"
            checked={isFixed}
            onCheckedChange={handleFixedChange}
          />
          <Label htmlFor="fixed-mode" className="cursor-pointer">
            Fixed Mode
          </Label>
        </div>
        <button
          onClick={handleSerializeReload}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto order-last sm:order-none"
        >
          Serialize & Reload
        </button>
        <div className="flex items-center space-x-2 p-2 border rounded sm:border-none sm:p-0 w-full sm:w-auto">
          <Checkbox
            id="include-layout"
            checked={includeLayout}
            onCheckedChange={handleLayoutChange}
          />
          <Label htmlFor="include-layout" className="cursor-pointer">
            Include layout
          </Label>
        </div>
      </div>
    </div>
  );
};

export default FullAdderPage;
