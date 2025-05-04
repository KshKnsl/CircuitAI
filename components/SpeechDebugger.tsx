"use client";
import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mic, MicOff } from "lucide-react";

export function SpeechDebugger() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [recognitionObj, setRecognitionObj] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      // Cleanup on unmount
      return () => {
        if (recognitionObj) {
          try {
            recognitionObj.stop();
          } catch (err) {
            // Ignore errors on unmount
          }
        }
      };
    }
  }, []);

  const startListening = () => {
    if (!isSupported || typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage("");
        setTranscript("Listening...");
      };
      
      recognition.onresult = (event: any) => {
        let finalText = '';
        let interimText = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        
        setTranscript((finalText || interimText) || "Listening...");
      };
      
      recognition.onerror = (event: any) => {
        setErrorMessage(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognitionObj(recognition);
      recognition.start();
    } catch (error: any) {
      setErrorMessage(`Failed to start: ${error.message}`);
    }
  };
  
  const stopListening = () => {
    if (recognitionObj) {
      try {
        recognitionObj.stop();
        setIsListening(false);
      } catch (error: any) {
        setErrorMessage(`Failed to stop: ${error.message}`);
      }
    }
  };

  if (isSupported === null) {
    return <div>Checking speech support...</div>;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Speech Recognition Test</span>
          {isSupported 
            ? <span className="text-sm text-green-500">Supported</span> 
            : <span className="text-sm text-red-500">Not Supported</span>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSupported ? (
          <div className="text-center p-4 bg-destructive/10 rounded-md">
            <p>Speech Recognition is not supported in this browser.</p>
            <p className="text-xs mt-2">Try Chrome, Edge, or Safari on desktop</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Button 
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                className="w-32"
              >
                {isListening ? (
                  <><MicOff className="mr-2 h-4 w-4" /> Stop</>
                ) : (
                  <><Mic className="mr-2 h-4 w-4" /> Start</>
                )}
              </Button>
            </div>
            
            <div className={`p-4 border rounded-md min-h-[100px] ${isListening ? 'bg-primary/5' : ''}`}>
              <p className="font-mono">{transcript || "Click Start and speak..."}</p>
            </div>
            
            {errorMessage && (
              <p className="text-destructive mt-2 text-sm">{errorMessage}</p>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Implementation: {window.SpeechRecognition ? "SpeechRecognition" : "webkitSpeechRecognition"}</p>
              <p className="truncate">Browser: {navigator.userAgent}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
