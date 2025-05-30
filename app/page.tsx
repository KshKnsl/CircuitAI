import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Code, FlaskConical, ArrowRight } from "lucide-react";
import Image from 'next/image';
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-b">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-[#0B304A]">
            CircuitAi
          </h1>
          <Image
            src="/logo.png"
            alt="CircuitAI Logo"
            width={200}
            height={200}
            className="mb-4"
          />
          <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
            The AI-powered logic gate simulator – design, simulate, and learn digital circuits with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild size="lg" className="gap-2">
              <a href="/ai-assistbot">
                Launch AI Circuit Builder <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/full-adder">
                View Full Adder Example
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CircuitBoard className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Interactive Visualization</CardTitle>
              <CardDescription>
                See your circuits come to life in a responsive, interactive environment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Visualize logic gates, connections, and signal flow with our intuitive interface. 
                Interact directly with inputs to see outputs change in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>AI Circuit Generation</CardTitle>
              <CardDescription>
                Describe the circuit you want and let AI build it for you
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Simply describe the circuit you need, and our AI assistant will generate a functional design instantly. 
                Experiment with different prompts to explore various circuit configurations.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <FlaskConical className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Simulate and Learn</CardTitle>
              <CardDescription>
                Explore pre-built examples and modify circuits in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Dive into pre-built examples like the Full Adder to understand fundamental concepts. 
                Modify existing circuits or build your own from scratch to deepen your knowledge.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="w-full py-6 text-center border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Powered by DigitalJS & Gemini AI
            <a href="https://www.producthunt.com/posts/circuitai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-circuitai" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=958872&theme=light&t=1745907417856" alt="CircuitAi - Instantly&#0032;Create&#0032;Digital&#0032;Logic&#0032;Circuits&#0032;with&#0032;AI | Product Hunt" style={{ width: '250px', height: '54px' }} width="250" height="54" /></a>
          </div>
          <div className="text-sm font-medium">
            Created by <a href="https://github.com/KshKnsl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kush Kansal</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
