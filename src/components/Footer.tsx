import { Instagram, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-secondary/50">
      <div className="container py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70">
              <span className="text-sm font-bold text-primary-foreground">EQ</span>
            </div>
            <span className="text-lg font-bold">EyeQ Club</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Vision, Innovation, Excellence
          </p>
          
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EyeQ Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
