"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DigitalCircuitViewer from "@/components/DigitalCircuitViewer";

const initialCircuitJson = {
  devices: {
      dev0: { type: "Button", label: "a", net: "a", order: 0, bits: 1 },
      dev1: { type: "Button", label: "b", net: "b", order: 1, bits: 1 },
      dev2: { type: "Button", label: "cin", net: "cin", order: 2, bits: 1 },
      dev3: { type: "Lamp", label: "s", net: "s", order: 3, bits: 1 },
      dev4: { type: "Lamp", label: "cout", net: "cout", order: 4, bits: 1 },
      dev5: { type: "Or", label: "or1", bits: 1 },
      dev6: { type: "Subcircuit", label: "ha1", celltype: "halfadder" },
      dev7: { type: "Subcircuit", label: "ha2", celltype: "halfadder" },
  },
  connectors: [
      { to: { id: "dev6", port: "a" }, from: { id: "dev0", port: "out" }, name: "a" },
      { to: { id: "dev6", port: "b" }, from: { id: "dev1", port: "out" }, name: "b" },
      { to: { id: "dev7", port: "b" }, from: { id: "dev2", port: "out" }, name: "cin" },
      { to: { id: "dev3", port: "in" }, from: { id: "dev7", port: "o" }, name: "s" },
      { to: { id: "dev4", port: "in" }, from: { id: "dev5", port: "out" }, name: "cout" },
      { to: { id: "dev5", port: "in1" }, from: { id: "dev6", port: "c" }, name: "c1" },
      { to: { id: "dev5", port: "in2" }, from: { id: "dev7", port: "c" }, name: "c2" },
      { to: { id: "dev7", port: "a" }, from: { id: "dev6", port: "o" }, name: "t" },
  ],
  subcircuits: {
      halfadder: {
          devices: {
              dev0: { type: "Input", label: "a", net: "a", order: 0, bits: 1 },
              dev1: { type: "Input", label: "b", net: "b", order: 1, bits: 1 },
              dev2: { type: "Output", label: "o", net: "o", order: 2, bits: 1 },
              dev3: { type: "Output", label: "c", net: "c", order: 3, bits: 1 },
              dev4: { type: "And", label: "and1", bits: 1 },
              dev5: { type: "Xor", label: "xor1", bits: 1 },
          },
          connectors: [
              { to: { id: "dev4", port: "in1" }, from: { id: "dev0", port: "out" }, name: "a_to_and" },
              { to: { id: "dev5", port: "in1" }, from: { id: "dev0", port: "out" }, name: "a_to_xor" },
              { to: { id: "dev4", port: "in2" }, from: { id: "dev1", port: "out" }, name: "b_to_and" },
              { to: { id: "dev5", port: "in2" }, from: { id: "dev1", port: "out" }, name: "b_to_xor" },
              { to: { id: "dev2", port: "in" }, from: { id: "dev5", port: "out" }, name: "o" },
              { to: { id: "dev3", port: "in" }, from: { id: "dev4", port: "out" }, name: "c" },
          ],
      },
  },
};
interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}
const AiAssistBotPage = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'system', text: 'Describe the circuit you want to build.' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentCircuitJson, setCurrentCircuitJson] = useState<object | null>(null);

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

    try {
      const response = await fetch('/api/generate-circuit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageText }),
      });

      const result = await response.json();
      console.log("AI response:", result);
      if (!response.ok) {
        const errorDetail = result.details || result.error || `API request failed with status ${response.status}`;
        throw new Error(errorDetail);
      }

      if (result.circuitJson) {
        setCurrentCircuitJson(result.circuitJson);

        if (result.explanation) {
          setChatMessages(prev => [...prev, { sender: 'ai', text: result.explanation }]);
        } else {
          setChatMessages(prev => [...prev, { sender: 'system', text: "Circuit generated, but explanation was missing or invalid." }]);
        }
      } else {
        const errorDetail = result.details || result.error || "Received an unexpected response format from the AI.";
        throw new Error(errorDetail);
      }

    } catch (error: any) {
      console.error("Error processing AI generation:", error);
      const errorMessage = error.message || "An unknown error occurred during circuit generation.";
      setChatMessages(prev => [...prev, { sender: 'system', text: `Error: ${errorMessage}` }]);
    } finally {
      setTimeout(() => setIsGenerating(false), 50);
    }
  };

  const handleClearCircuit = () => {
    setCurrentCircuitJson(null);
    setChatMessages(prev => [...prev, { sender: 'system', text: "Circuit cleared." }]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      <div className="flex-grow flex flex-col overflow-auto p-4">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-5xl mx-auto bg-background rounded-lg shadow border border-border p-4">
            <DigitalCircuitViewer
              circuitJson={initialCircuitJson}
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
                  {msg.text.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
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
