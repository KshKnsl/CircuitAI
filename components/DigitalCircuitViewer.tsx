"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, RefreshCw } from "lucide-react";

interface DigitalCircuitViewerProps {
    circuitJson?: object | null;
}

const DigitalCircuitViewer: React.FC<DigitalCircuitViewerProps> = ({ circuitJson }) => {
    const paperRef = useRef<HTMLDivElement>(null);
    const circuitRef = useRef<any>(null);

    const [isFixed, setIsFixed] = useState(false);
    const [includeLayout, setIncludeLayout] = useState(true);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const cleanupCircuit = () => {
        if (circuitRef.current) {
            try {
                circuitRef.current.stop();
            } catch (e) {
                console.warn("Error stopping circuit during cleanup:", e);
            }
            circuitRef.current = null;
        }
    };

    const loadOrUpdateCircuit = (currentJson: object | null | undefined) => {
        if (!scriptLoaded || !paperRef.current) {
            setIsLoading(true);
            setErrorMsg(null);
            return;
        }

        cleanupCircuit();
        setErrorMsg(null);

        if (!currentJson) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const digitaljs = (window as any).digitaljs;
        const digitalJsContainer = paperRef.current;

        try {
            digitalJsContainer.innerHTML = '';

            const circuit = new digitaljs.Circuit(currentJson);
            circuitRef.current = circuit;

            circuit.on("new:paper", (paper: any) => {
                if (paper && typeof paper.fixed === 'function') {
                    console.log(`Setting fixed mode to ${isFixed} on new paper`);
                    paper.fixed(isFixed);
                }
            });

            circuit.displayOn(digitalJsContainer);
            circuit.start();

            if (circuit.papers) {
                Object.values(circuit.papers).forEach((p: any) => {
                    if (p && typeof p.fixed === 'function') {
                        p.fixed(isFixed);
                    }
                });
            }

            setIsLoading(false);
        } catch (error: any) {
            console.error("Error loading/initializing digitaljs circuit:", error);
            setErrorMsg(`Error loading circuit: ${error.message}`);
            if (digitalJsContainer) {
                digitalJsContainer.innerHTML = `<p class="p-4 text-center text-destructive">Error loading circuit: ${error.message}</p>`;
            }
            setIsLoading(false);
            circuitRef.current = null;
        }
    };

    const applyFixedModeToPapers = (fixed: boolean) => {
        if (circuitRef.current && circuitRef.current.papers) {
            console.log(`Applying fixed mode: ${fixed} to all papers`);
            try {
                Object.values(circuitRef.current.papers).forEach((p: any) => {
                    if (p && typeof p.fixed === 'function') {
                        p.fixed(fixed);
                    }
                });
            } catch (e) {
                console.warn("Error applying fixed mode:", e);
            }
        }
    };

    useEffect(() => {
        loadOrUpdateCircuit(circuitJson);
        const timer = setTimeout(() => {
            applyFixedModeToPapers(isFixed);
        }, 100);

        return () => clearTimeout(timer);
    }, [scriptLoaded, circuitJson]);

    useEffect(() => {
        applyFixedModeToPapers(isFixed);
    }, [isFixed]);

    useEffect(() => {
        return () => {
            console.log("Component unmounting, stopping circuit.");
            if (circuitRef.current) {
                try {
                    circuitRef.current.stop();
                    console.log("Circuit stopped on unmount.");
                } catch (e) {
                    console.warn("Error stopping circuit during unmount cleanup:", e);
                }
                circuitRef.current = null;
            }
        };
    }, []);

    const handleFixedChange = (checked: boolean | "indeterminate") => {
        setIsFixed(!!checked);
    };

    const handleSerializeReload = () => {
        if (!circuitRef.current) return;
        try {
            console.log("Serializing circuit with includeLayout =", includeLayout);
            const currentJson = circuitRef.current.toJSON(includeLayout);
            console.log(`Serialized JSON:`, currentJson);
            loadOrUpdateCircuit(currentJson);
        } catch (error: any) {
            console.error("Error during serialize/reload:", error);
            setErrorMsg(`Error during serialize/reload: ${error.message}`);
            if (paperRef.current) {
                paperRef.current.innerHTML = `<p class="p-4 text-center text-destructive">Error during serialize/reload: ${error.message}</p>`;
            }
        }
    };

    const getPlaceholderText = () => {
        if (errorMsg) return errorMsg;
        if (!scriptLoaded) return "Loading circuit engine...";
        if (isLoading && circuitJson) return "Loading circuit...";
        if (!circuitJson) return "Generated circuit will appear here.";
        return "";
    };

    const showPlaceholder = !circuitJson || isLoading || errorMsg;
    const controlsDisabled = !scriptLoaded || !circuitJson || isLoading || !!errorMsg;

    return (
        <div className="flex flex-col gap-4 w-full h-auto box-border">
            <Script
                src="/digital.js"
                strategy="lazyOnload"
                onLoad={() => {
                    setScriptLoaded(true);
                    setIsLoading(false);
                }}
                onError={(e) => {
                    console.error("Error loading digitaljs script:", e);
                    setErrorMsg("Error loading digitaljs script.");
                    setIsLoading(false);
                }}
            />

            <div
                className="h-[400px] w-full md:max-w-[800px] mx-auto box-border bg-background flex items-center justify-center text-muted-foreground relative overflow-auto"
            >
                {showPlaceholder ? (
                    <p className="p-4 text-center">{getPlaceholderText()}</p>
                ) : (
                    <div ref={paperRef} id="paper-main" className="w-full h-full relative" />
                )}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-center">
                <div className="flex items-center space-x-2 p-2 border border-input rounded sm:border-none sm:p-0">
                    <Checkbox
                        id="fixed-mode-main"
                        checked={isFixed}
                        onCheckedChange={handleFixedChange}
                        disabled={controlsDisabled}
                        aria-label="Toggle Fixed Mode"
                    />
                    <Label htmlFor="fixed-mode-main" className="cursor-pointer text-xs" title="Fixed Mode">
                        <Lock className="h-4 w-4 inline mr-1" /> Fix Layout
                    </Label>
                </div>

                <div className="flex items-center space-x-2 p-2 border border-input rounded sm:border-none sm:p-0">
                    <Checkbox
                        id="include-layout-main"
                        checked={includeLayout}
                        onCheckedChange={(checked) => setIncludeLayout(!!checked)}
                        disabled={controlsDisabled}
                        aria-label="Include Layout in Serialization"
                    />
                    <Label htmlFor="include-layout-main" className="cursor-pointer text-xs" title="Include Layout">
                        Include Layout
                    </Label>
                </div>

                <Button
                    variant="secondary"
                    onClick={handleSerializeReload}
                    className="px-3 py-1.5 text-sm"
                    disabled={controlsDisabled}
                    title="Serialize & Reload"
                    aria-label="Serialize and Reload Circuit"
                >
                    <RefreshCw className="h-4 w-4 mr-1" /> Reload
                </Button>
            </div>
        </div>
    );
};

export default DigitalCircuitViewer;
