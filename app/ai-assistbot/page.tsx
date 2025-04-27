"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script"; // Import the Script component
import { Input } from "@/components/ui/input"; // Import Shadcn Input
import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // For chat UI styling

// Define message type
interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}

const AiAssistBotPage = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<any>(null); // Replace 'any' with actual digitaljs types if available
  const papersRef = useRef<{ [key: string]: any }>({}); // Keep track of papers for potential future features like fixed mode

  const [scriptLoaded, setScriptLoaded] = useState(false);

  // State for AI Chat
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'system', text: 'Loading circuit engine...' } // Initial message
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll chat

  // State for the placeholder text inside the paper div
  const [paperPlaceholder, setPaperPlaceholder] = useState<string>("Loading circuit engine...");

  const cleanupCircuit = () => {
    if (circuitRef.current) {
      // Stop the simulation first
      circuitRef.current.stop();

      // Attempt to remove papers managed by digitaljs/jointjs
      Object.values(papersRef.current).forEach((paper: any) => {
        try {
          paper?.remove(); // JointJS method to remove the paper's view
        } catch (e) {
          console.warn("Error removing paper:", e);
        }
      });
    }
    // Reset refs
    circuitRef.current = null;
    papersRef.current = {};
  };

  // Basic applyFixedMode in case it's needed later or by digitaljs internals
  const applyFixedMode = (fixed: boolean) => {
    Object.values(papersRef.current).forEach((p) => p?.fixed?.(fixed));
  };

  const loadCircuit = (json: object) => {
    cleanupCircuit(); // Ensure previous circuit is cleared

    if (typeof window === "undefined" || !(window as any).digitaljs) {
      console.error("digitaljs library is not loaded or ready.");
      setChatMessages(prev => [...prev, { sender: 'system', text: "Error: digitaljs library not loaded." }]);
      setPaperPlaceholder("Error: digitaljs library not loaded."); // Show error in placeholder
      return false; // Indicate failure
    }
    const digitaljs = (window as any).digitaljs;

    try {
      const circuit = new digitaljs.Circuit(json);
      circuitRef.current = circuit;

      // Keep track of new papers
      circuit.on("new:paper", (paper: any) => {
        papersRef.current[paper.cid] = paper; // Store the paper reference
        paper.on("element:pointerdblclick", (cellView: any) => {
          (window as any).digitaljsCell = cellView.model;
          console.info(
            "You can now access the doubly clicked gate as digitaljsCell in your WebBrowser console!"
          );
        });
      });

      circuit.on("remove:paper", (paper: any) => {
        // Ensure paper is removed from our ref when digitaljs removes it
        if (papersRef.current[paper.cid]) {
          delete papersRef.current[paper.cid];
        }
      });

      if (paperRef.current) {
        // Explicitly clear the container *before* digitaljs renders into it.
        paperRef.current.innerHTML = "";
        circuit.displayOn(paperRef.current);
        setPaperPlaceholder(""); // Clear placeholder text after successful display
      }

      circuit.start();
      return true; // Indicate success
    } catch (error: any) {
      console.error("Error loading/initializing digitaljs circuit:", error);
      setChatMessages(prev => [...prev, { sender: 'system', text: `Error loading circuit: ${error.message}` }]);
      setPaperPlaceholder(`Error loading circuit: ${error.message}`); // Show error in placeholder
      return false; // Indicate failure
    }
  };

  // Effect to cleanup circuit on unmount
  useEffect(() => {
    return () => {
      cleanupCircuit();
    };
  }, []);

  // Effect to scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Effect to update placeholder text based on client-side state changes
  useEffect(() => {
    if (!scriptLoaded) {
      setPaperPlaceholder("Loading circuit engine...");
    } else if (!circuitRef.current) {
      setPaperPlaceholder("Circuit will appear here after generation.");
    } else {
      setPaperPlaceholder("");
    }
  }, [scriptLoaded, circuitRef.current]);

  const handleSendMessage = async () => {
    const messageText = chatInput.trim();
    if (!messageText || isGenerating) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: messageText };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsGenerating(true);
    setPaperPlaceholder("Generating circuit..."); // Update placeholder during generation

    try {
      // Call the dedicated API route
      const response = await fetch('/api/generate-circuit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageText }),
      });

      const result = await response.json();
      console.log("AI response:", result); // Log the AI response for debugging
      if (!response.ok) {
        throw new Error(result.error || `API request failed with status ${response.status}`);
      }

      if (result.circuitJson && result.explanation) {
        const loadSuccess =true;// loadCircuit(result.circuitJson);
        if (loadSuccess) {
          setChatMessages(prev => [...prev, { sender: 'ai', text: result.explanation }]);
        }
      } else if (result.circuitJson) {
        const loadSuccess = loadCircuit(result.circuitJson);
        if (loadSuccess) {
          setChatMessages(prev => [...prev, { sender: 'system', text: "Circuit loaded, but explanation was missing or invalid." }]);
        }
      } else {
        throw new Error(result.error || "Received an unexpected response format from the AI.");
      }

    } catch (error: any) {
      console.error("Error processing AI generation:", error);
      const errorMessage = error.message || "An unknown error occurred during circuit generation.";
      setChatMessages(prev => [...prev, { sender: 'system', text: `Error: ${errorMessage}` }]);
      setPaperPlaceholder(`Error: ${errorMessage}`); // Show error in placeholder
    } finally {
      setIsGenerating(false);
      if (!circuitRef.current && scriptLoaded) {
        setPaperPlaceholder("Circuit generation failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen overflow-hidden">
      {/* Circuit Area */}
      <div className="flex-grow flex flex-col gap-4 p-4 overflow-y-auto">
        <Script
          src="/digital.js"
          strategy="lazyOnload"
          onLoad={() => {
            console.log("digitaljs script loaded.");
            setScriptLoaded(true);
            setChatMessages(prev => [...prev, { sender: 'system', text: 'Circuit engine ready. Describe the circuit you want to build.' }]);
          }}
          onError={(e) => {
            console.error("Error loading digitaljs script:", e);
            setChatMessages(prev => [...prev, { sender: 'system', text: 'Error loading circuit engine. Please refresh.' }]);
            setPaperPlaceholder('Error loading circuit engine. Please refresh.');
          }}
        />

        {/* Circuit Display Area */}
        <div
          ref={paperRef}
          id="paper"
          className="min-h-[300px] flex-grow border border-gray-300 w-full box-border bg-white rounded shadow flex items-center justify-center"
        >
          {paperPlaceholder && <p className="p-4 text-gray-500">{paperPlaceholder}</p>}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-l border-gray-300 flex flex-col h-full max-h-screen bg-gray-50">
        <Card className="flex flex-col flex-grow h-full border-0 rounded-none">
          <CardHeader className="border-b">
            <CardTitle>AI Circuit Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white' :
                  msg.sender === 'ai' ? 'bg-gray-200 text-gray-900' :
                  'bg-yellow-100 text-yellow-800 text-sm italic'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}<br/></React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full space-x-2">
              <Input
                type="text"
                placeholder={scriptLoaded ? "e.g., 'Create an AND gate'" : "Loading engine..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && scriptLoaded && handleSendMessage()}
                disabled={isGenerating || !scriptLoaded}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} disabled={isGenerating || !chatInput.trim() || !scriptLoaded}>
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
