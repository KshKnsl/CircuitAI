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

export default function Home() {
  return (
    <main className="flex flex-col flex-1 w-full bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 sm:py-16 md:py-28 lg:py-36 border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-primary drop-shadow-sm">
            CircuitAi
          </h1>
          <Image
            src="/logo.png"
            alt="CircuitAI Logo"
            width={200}
            height={200}
            className="mb-4 rounded-xl shadow-lg"
          />
          <p className="max-w-[700px] text-xl md:text-2xl text-muted-foreground">
            The AI-powered logic gate simulator – design, simulate, and learn digital circuits with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md mx-auto">
            <Button asChild size="lg" className="gap-2 shadow-lg">
              <a href="/ai-assistbot">
                Launch AI Circuit Builder <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow">
              <Link href="/full-adder">
                View Full Adder Example
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-12 sm:py-16 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="flex flex-col h-full bg-card/80 border border-border shadow-md rounded-xl">
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

          <Card className="flex flex-col h-full bg-card/80 border border-border shadow-md rounded-xl">
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

          <Card className="flex flex-col h-full bg-card/80 border border-border shadow-md rounded-xl">
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
    </main>
  );
}
