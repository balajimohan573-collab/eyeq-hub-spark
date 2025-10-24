import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <span className="text-xl font-bold text-primary-foreground">EQ</span>
          </div>
          <span className="text-xl font-bold">EyeQ Club</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button
              variant="ghost"
              className={isActive("/") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              Home
            </Button>
          </Link>
          <Link to="/projects">
            <Button
              variant="ghost"
              className={isActive("/projects") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              Projects
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="ghost"
              className={isActive("/contact") ? "text-primary" : "text-muted-foreground hover:text-foreground"}
            >
              Contact
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container py-4 flex flex-col space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
              >
                Home
              </Button>
            </Link>
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive("/projects") ? "text-primary" : "text-muted-foreground"}`}
              >
                Projects
              </Button>
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isActive("/contact") ? "text-primary" : "text-muted-foreground"}`}
              >
                Contact
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
