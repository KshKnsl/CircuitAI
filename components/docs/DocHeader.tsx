import React from 'react';
import Link from 'next/link';
import { MenuIcon, Search, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocHeaderProps {
  title: string;
}

const DocHeader: React.FC<DocHeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">CircuitsAI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/docs" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Documentation
            </Link>
            <Link href="/examples" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Examples
            </Link>
            <Link href="/api" className="transition-colors hover:text-foreground/80 text-foreground/60">
              API
            </Link>
          </nav>
        </div>
        
        <Button variant="outline" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="inline-flex items-center rounded-md font-normal text-sm h-8 w-full justify-start text-muted-foreground md:w-40 lg:w-64">
              <Search className="mr-2 h-4 w-4" />
              <span>Search docs...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          <nav className="flex items-center">
            <Link href="https://github.com/your-org/circuits-ai" target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DocHeader;
