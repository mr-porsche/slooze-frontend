import { Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className='bg-border border-t border-border mt-auto'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-2 text-sm'>
          <p>2025 Slooze Commodities Management System</p>
          <div className='flex items-center gap-2'>
            <p>Built with Vite(React) & TypeScript</p>
            <a
              href='https://github.com/mr-porsche/slooze-frontend'
              target='_blank'
              className='flex items-center gap-1 text-foreground hover:text-muted-foreground transition-colors hover:underline underline-offset-6'
            >
              <Github />
              <span>GitHub</span>
            </a>
            <a
              href='mailto:@ilyas.sayyed@hotmail.com'
              className='flex items-center gap-1 text-foreground hover:text-muted-foreground transition-colors hover:underline underline-offset-6'
            >
              <Mail />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
