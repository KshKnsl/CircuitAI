import React from 'react';
import fs from 'fs';
import path from 'path';
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
import DocHeader from '@/components/docs/DocHeader';
import { notFound } from 'next/navigation'
import Link from 'next/link';

interface Params {
  slug: string;
}

interface PageProps {
  params: Params;
}

async function getMarkdownContent(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'docs', `${slug}.md`);
  try {
    const markdownContent = fs.readFileSync(filePath, 'utf-8');
    return markdownContent;
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return '';
  }
}

const rehypePrettyCodeOptions = {
  theme: 'github-dark',
  onVisitLine(ast: any) {
    if (ast.children.length === 0) {
      ast.children = [{type: 'text', value: ' '}];
    }
  },
  onVisitHighlightedLine(ast: any) {
    ast.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(ast: any) {
    ast.properties.className = ['word--highlighted'];
  },
};

async function getHtmlFromMarkdown(markdownContent: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode as any, rehypePrettyCodeOptions)
    .use(rehypeStringify)
    .process(markdownContent)

  return String(file)
}

const DocPage: React.FC<PageProps> = async ({ params }) => {
  const { slug } = params;
  const markdownContent = await getMarkdownContent(slug);
  
  if (!markdownContent) {
    notFound();
  }
  
  const htmlContent = await getHtmlFromMarkdown(markdownContent);
  
  // Derive the title from the slug for simplicity
  const title = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DocHeader title={title} />
      
      <div className="flex flex-1">
        {/* Static Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-border overflow-y-auto h-[calc(100vh-56px)] sticky top-[56px]">
          <div className="p-6">
            <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
              On This Page
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#digitaljs" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  DigitalJS
                </a>
              </li>
              <li>
                <a href="#usage" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground pl-3">
                  Usage
                </a>
              </li>
              <li>
                <a href="#input-format" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Input format
                </a>
              </li>
              <li>
                <a href="#device-types" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  Device types
                </a>
              </li>
              <li>
                <a href="#todo" className="block py-1 text-sm transition-colors hover:text-primary text-muted-foreground">
                  TODO
                </a>
              </li>
            </ul>
            
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Documentation
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/docs/digitaljs-overview" 
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    DigitalJS Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/docs/getting-started" 
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/docs/api-reference" 
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/docs/circuit-examples" 
                    className="block py-1 text-sm transition-colors text-muted-foreground hover:text-primary"
                  >
                    Circuit Examples
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        
        {/* Mobile menu button */}
        <button className="md:hidden fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground mt-2">Documentation and guides for using {title}</p>
            </div>
            
            <article className="prose dark:prose-invert prose-headings:scroll-mt-20 prose-code:text-primary prose-a:text-primary max-w-none">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </article>
            
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                Back to all documentation
              </Link>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocPage;
