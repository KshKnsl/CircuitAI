import React from 'react';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface DocSidebarProps {
  headings: Heading[];
  currentSlug: string;
}

const DocSidebar: React.FC<DocSidebarProps> = ({ headings, currentSlug }) => {
  const navItems = useMemo(() => {
    // Filter to headings level 1-3 for the sidebar
    return headings.filter(heading => heading.level <= 3);
  }, [headings]);

  return (
    <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-border overflow-y-auto h-[calc(100vh-60px)] sticky top-[60px]">
      <div className="p-6">
        <nav>
          <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
            On This Page
          </h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block py-1 text-sm transition-colors hover:text-foreground",
                    item.level === 1 ? "font-medium" : "",
                    item.level === 2 ? "pl-4" : "",
                    item.level === 3 ? "pl-8" : "",
                    "text-muted-foreground hover:text-primary"
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
              Documentation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/docs/digitaljs-overview" 
                  className={cn(
                    "block py-1 text-sm transition-colors",
                    currentSlug === 'digitaljs-overview' 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  DigitalJS Overview
                </Link>
              </li>
              {/* Add more documentation links here */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DocSidebar;
