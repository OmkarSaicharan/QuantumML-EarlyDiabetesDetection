import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Stethoscope, User, LogOut, History, Camera, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">DermaVision</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/analyze"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Camera className="h-4 w-4" />
                Analyze Skin
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <History className="h-4 w-4" />
                History
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/analyze")}>
                    <Camera className="mr-2 h-4 w-4" />
                    New Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/history")}>
                    <History className="mr-2 h-4 w-4" />
                    View History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/analyze"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="h-4 w-4" />
                  Analyze Skin
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History className="h-4 w-4" />
                  History
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
