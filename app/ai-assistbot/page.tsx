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
import { ExternalLink, HelpCircle, Code, Github, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { SpeechDebugger } from "@/components/SpeechDebugger";

// Add these type definitions
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

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
  
  // Speech recognition states
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Speech synthesis states
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Add additional debug state
  const [speechDebugInfo, setSpeechDebugInfo] = useState<string>("");

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
      }
      
      // Check for speech synthesis support
      if (window.speechSynthesis) {
        setIsSpeechSynthesisSupported(true);
        synthRef.current = window.speechSynthesis;
      }
    }
  }, []);
  
  // Setup speech recognition when voice is enabled
  useEffect(() => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechDebugInfo("Speech recognition not available in this browser");
      return;
    }
    
    try {
      // Create a new recognition instance
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      setSpeechDebugInfo("Speech recognition initialized");
      
      recognitionRef.current.onstart = () => {
        setSpeechDebugInfo("Recognition started");
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            setSpeechDebugInfo(`Final transcript: ${finalTranscript}`);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setSpeechDebugInfo(`Interim transcript: ${interimTranscript}`);
          }
        }
        
        if (finalTranscript) {
          setChatInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setSpeechDebugInfo(`Speech recognition error: ${event.error}`);
        console.error("Speech recognition error:", event);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setSpeechDebugInfo("Recognition ended");
        setIsListening(false);
      };
    } catch (error) {
      setSpeechDebugInfo(`Error creating speech recognition: ${error}`);
      console.error("Error creating speech recognition:", error);
    }
    
    return () => {
      if (recognitionRef.current) {
        // Clean up event handlers
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onstart = null;
        
        try {
          recognitionRef.current.stop();
          setSpeechDebugInfo("Recognition stopped and cleaned up");
        } catch (err) {
          setSpeechDebugInfo(`Error stopping recognition: ${err}`);
        }
      }
    };
  }, [voiceEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
  
  // Speech synthesis for AI responses
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    if (speakEnabled && 
        isSpeechSynthesisSupported && 
        synthRef.current && 
        lastMessage && 
        lastMessage.sender === 'ai' && 
        !lastMessage.isLoading) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Speak the response
      synthRef.current.speak(utterance);
    }
  }, [chatMessages, speakEnabled, isSpeechSynthesisSupported]);

  const toggleListening = () => {
    if (!isSpeechSupported || !voiceEnabled) {
      setSpeechDebugInfo("Speech recognition not supported or not enabled");
      return;
    }
    
    // If recognition instance doesn't exist, create one on-demand
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          
          recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
            
            if (finalTranscript) {
              setChatInput(finalTranscript);
            }
          };
          
          recognitionRef.current.onerror = (event: any) => {
            setSpeechDebugInfo(`Error: ${event.error}`);
            setIsListening(false);
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
          
          setSpeechDebugInfo("Created speech recognition on-demand");
        } catch (error) {
          setSpeechDebugInfo(`Failed to create speech recognition: ${error}`);
          return;
        }
      } else {
        setSpeechDebugInfo("Speech recognition API not available");
        return;
      }
    }
    
    if (isListening) {
      try {
        recognitionRef.current.stop();
        setSpeechDebugInfo("Stopping recognition");
      } catch (err) {
        setSpeechDebugInfo(`Error stopping recognition: ${err}`);
      }
    } else {
      try {
        recognitionRef.current.start();
        setSpeechDebugInfo("Starting recognition");
      } catch (error) {
        setSpeechDebugInfo(`Error starting recognition: ${error}`);
      }
    }
  };
  
  const toggleVoiceEnabled = (checked: boolean) => {
    setVoiceEnabled(checked);
    
    // Stop listening if turning voice off
    if (!checked && isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping speech recognition:", err);
      }
      setIsListening(false);
    }
  };
  
  const toggleSpeakEnabled = (checked: boolean) => {
    setSpeakEnabled(checked);
    
    // Stop speaking if turning off
    if (!checked && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const handleSendMessage = async () => {
    const messageText = chatInput.trim();
    if (!messageText || isGenerating) return;

    // Stop listening while generating
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    // Stop speaking before generating new response
    if (synthRef.current) {
      synthRef.current.cancel();
    }

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
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <HelpCircle size={16} />
              <span>Documentation</span>
            </Link>
            <a 
              href="https://github.com/KshKnsl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Github size={16} />
              <span>Created by Kush Kansal</span>
            </a>
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
            
            {/* Paste JSON Dialog */}
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
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI Circuit Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">by <a href="https://github.com/KshKnsl" target="_blank" rel="noopener noreferrer" className="hover:underline">Kush Kansal</a></p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCircuit} disabled={!currentCircuitJson && !isGenerating}>
                Clear Circuit
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <TooltipProvider>
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="voice-input"
                          checked={voiceEnabled}
                          onCheckedChange={toggleVoiceEnabled}
                          disabled={!isSpeechSupported}
                        />
                        <Label htmlFor="voice-input" className="cursor-pointer text-sm">Voice Input</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSpeechSupported 
                        ? "Enable voice commands" 
                        : "Speech recognition not supported in this browser"}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="voice-output"
                          checked={speakEnabled}
                          onCheckedChange={toggleSpeakEnabled}
                          disabled={!isSpeechSynthesisSupported}
                        />
                        <Label htmlFor="voice-output" className="cursor-pointer text-sm">Voice Output</Label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSpeechSynthesisSupported 
                        ? "Read responses aloud" 
                        : "Speech synthesis not supported in this browser"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* Speech debug info (only visible when voice input is enabled) */}
            {voiceEnabled && speechDebugInfo && (
              <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                <p>Status: {isListening ? "Listening" : "Not listening"}</p>
                <p>{speechDebugInfo}</p>
                <p className="text-xs opacity-70">Browser: {typeof navigator !== 'undefined' ? navigator.userAgent.split(' ').slice(-3).join(' ') : ''}</p>
              </div>
            )}
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
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder={isListening ? "Listening..." : "Describe a circuit..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isGenerating || isListening}
                  className={`flex-grow pr-10 ${isListening ? 'bg-primary/10' : ''}`}
                />
                {voiceEnabled && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1 h-7 w-7"
                    onClick={toggleListening}
                    disabled={isGenerating || !isSpeechSupported}
                  >
                    {isListening ? (
                      <MicOff size={16} className="text-destructive" />
                    ) : (
                      <Mic size={16} className={isSpeechSupported ? "text-primary" : "text-muted-foreground"} />
                    )}
                  </Button>
                )}
              </div>
              <Button 
                onClick={handleSendMessage} 
                disabled={isGenerating || (!chatInput.trim() && !isListening)}
              >
                {isGenerating ? 'Generating...' : 'Send'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const AiAssistBotWithDebug = () => {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <AiAssistBotPage />
      {isDev && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="sm"
            variant="outline"
            className="mb-2"
            onClick={() => {
              const debugEl = document.getElementById('speech-debugger');
              if (debugEl) {
                debugEl.style.display = debugEl.style.display === 'none' ? 'block' : 'none';
              }
            }}
          >
            Speech Debug
          </Button>
          <div id="speech-debugger" className="hidden">
            <SpeechDebugger />
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistBotWithDebug;
