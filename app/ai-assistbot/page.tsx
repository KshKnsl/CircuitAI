"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DigitalCircuitViewer from "@/components/DigitalCircuitViewer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, HelpCircle, Code } from "lucide-react";
import Link from "next/link";

const initialCircuitJson = {
  devices: {
    dev0: { type: "Button", label: "Input" },
    dev1: { type: "Lamp", label: "Output" }
  },
  connectors: [
    { to: { id: "dev1", port: "in" }, from: { id: "dev0", port: "out" }, name: "processing..." },
  ],
  subcircuits: {},
};

interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
  isLoading?: boolean;
}

const AiAssistBotPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'system', text: 'Describe the circuit you want to build.' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentCircuitJson, setCurrentCircuitJson] = useState<object | null>(null);
  const [isCircuitOpen, setIsCircuitOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const [isViewJsonDialogOpen, setIsViewJsonDialogOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    const messageText = chatInput.trim();
    if (!messageText || isGenerating) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: messageText };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsGenerating(true);
    setCurrentCircuitJson(null);

    setChatMessages(prev => [...prev, { sender: 'ai', text: 'Generating response', isLoading: true }]);

    try {
      const response = await fetch('/api/generate-circuit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageText }),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorDetail = result.details || result.error || `API request failed with status ${response.status}`;
        throw new Error(errorDetail);
      }

      if (result.circuitJson) {
        setCurrentCircuitJson(result.circuitJson);

        if (result.explanation) {
          setChatMessages(prev => [...prev.filter(msg => !msg.isLoading), { sender: 'ai', text: result.explanation }]);
        } else {
          setChatMessages(prev => [...prev.filter(msg => !msg.isLoading), { sender: 'system', text: "Circuit generated, but explanation was missing or invalid." }]);
        }
      } else {
        const errorDetail = result.details || result.error || "Received an unexpected response format from the AI.";
        throw new Error(errorDetail);
      }

    } catch (error: unknown) {
      console.error("Error processing AI generation:", error);
      const errorMessage = (error as Error).message || "An unknown error occurred during circuit generation.";
      setChatMessages(prev => [...prev.filter(msg => !msg.isLoading), { sender: 'system', text: `Error: ${errorMessage}` }]);
    } finally {
      setTimeout(() => setIsGenerating(false), 50);
    }
  };

  const handleClearCircuit = () => {
    setCurrentCircuitJson(null);
    setChatMessages(prev => [...prev, { sender: 'system', text: "Circuit cleared." }]);
  };

  const handleJsonSubmit = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      
      // Basic validation to check for required structure
      if (!parsedJson.devices || typeof parsedJson.devices !== 'object') {
        throw new Error("JSON must contain a 'devices' object");
      }
      if (!parsedJson.connectors || !Array.isArray(parsedJson.connectors)) {
        throw new Error("JSON must contain a 'connectors' array");
      }

      setCurrentCircuitJson(parsedJson);
      setIsJsonDialogOpen(false);
      setJsonError("");
      setChatMessages(prev => [...prev, { sender: 'system', text: "Circuit loaded from JSON." }]);
    } catch (error) {
      setJsonError((error as Error).message || "Invalid JSON format");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      <div className="md:hidden flex items-center justify-center p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">View Circuit</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Digital Circuit</AlertDialogTitle>
              <AlertDialogDescription>
                Here's the circuit generated by the AI.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <DigitalCircuitViewer circuitJson={currentCircuitJson || initialCircuitJson} />
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex-grow flex flex-col overflow-auto p-4 md:block hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <HelpCircle size={16} />
              <span>Documentation</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {/* View JSON Dialog */}
            <AlertDialog open={isViewJsonDialogOpen} onOpenChange={setIsViewJsonDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!currentCircuitJson}>
                  <Code size={16} className="mr-1" />
                  View JSON
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-3xl max-h-[80vh]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Circuit JSON</AlertDialogTitle>
                  <AlertDialogDescription>
                    Current circuit representation in JSON format
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="overflow-auto max-h-[60vh]">
                  <pre className="bg-muted p-4 rounded-md text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                    {currentCircuitJson ? JSON.stringify(currentCircuitJson, null, 2) : "No circuit available"}
                  </pre>
                </div>
                <AlertDialogFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (currentCircuitJson) {
                        navigator.clipboard.writeText(JSON.stringify(currentCircuitJson, null, 2));
                      }
                    }}
                    disabled={!currentCircuitJson}
                  >
                    Copy to Clipboard
                  </Button>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {/* Paste JSON Dialog - existing code */}
            <AlertDialog open={isJsonDialogOpen} onOpenChange={setIsJsonDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">Paste JSON</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter Circuit JSON</AlertDialogTitle>
                  <AlertDialogDescription>
                    Paste your DigitalJS circuit JSON here. This will replace the current circuit.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <Textarea 
                    value={jsonInput} 
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"devices":{"dev0":{"type":"Button","label":"Input"}},"connectors":[...]}'
                    className="min-h-[200px] font-mono text-sm"
                  />
                  {jsonError && <p className="text-sm text-destructive">{jsonError}</p>}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setJsonError("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleJsonSubmit}>Apply JSON</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" size="sm" onClick={handleClearCircuit} disabled={!currentCircuitJson && !isGenerating}>
              Clear
            </Button>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-5xl mx-auto bg-background rounded-lg shadow border border-border p-4">
            <DigitalCircuitViewer
              circuitJson={currentCircuitJson || initialCircuitJson}
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-96 border-l border-border flex flex-col h-full max-h-screen bg-muted/30">
        <Card className="flex flex-col flex-grow h-full border-0 rounded-none bg-transparent">
          <CardHeader className="border-b border-border flex flex-row items-center justify-between">
            <CardTitle>AI Circuit Assistant</CardTitle>
            <Button variant="outline" size="sm" onClick={handleClearCircuit} disabled={!currentCircuitJson && !isGenerating}>
              Clear Circuit
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 px-3 rounded-lg max-w-[85%] shadow-sm ${
                  msg.sender === 'user' ? 'bg-primary text-primary-foreground' :
                  msg.sender === 'ai' ? 'bg-secondary text-secondary-foreground' :
                  'bg-accent text-accent-foreground text-sm italic'
                }`}>
                  {msg.isLoading ? (
                    <span className="animate-pulse">{msg.text}</span>
                  ) : (
                    msg.text.split('\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t border-border p-4 bg-background">
            <div className="flex w-full space-x-2">
              <Input
                type="text"
                placeholder={"Describe a circuit..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isGenerating}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={isGenerating || !chatInput.trim()}>
                {isGenerating ? 'Generating...' : 'Send'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AiAssistBotPage;
