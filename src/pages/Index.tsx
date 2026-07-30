import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, Users, TrendingUp, MapPin, Shield, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const { isAdmin, adminLogout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogout = () => {
    adminLogout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-mono font-bold text-sm">IG</span>
              </div>
              <div className="leading-tight">
                <h1 className="font-display font-bold text-lg text-primary-foreground tracking-tight uppercase">
                  Civic Issue Reporter
                </h1>
                <p className="font-mono text-[11px] text-primary-foreground/60 uppercase tracking-wider">
                  IGDTUW &middot; Facilities Desk
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-accent text-accent-foreground border-0 font-mono uppercase text-[10px] tracking-wider">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Mode
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/10 hover:!text-primary-foreground"
                  >
                    Exit Admin
                  </Button>
                </div>
              )}

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-primary-foreground/70 hidden lg:inline-block font-mono">{user.email}</span>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/10 hover:!text-primary-foreground">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/10 hover:!text-primary-foreground">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-primary-foreground/20">
              {isAdmin && (
                <div className="flex flex-col space-y-3 mb-4">
                  <div className="flex items-center justify-center">
                    <Badge className="bg-accent text-accent-foreground border-0 font-mono uppercase text-[10px] tracking-wider">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin Mode
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground w-full"
                  >
                    Exit Admin
                  </Button>
                </div>
              )}

              {user ? (
                <div className="flex flex-col space-y-3">
                  <div className="text-center text-sm text-primary-foreground/70 py-2 font-mono">{user.email}</div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground w-full">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground w-full">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 px-4 border-b border-border">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
                Campus Work Order System
              </p>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] uppercase text-foreground">
                Report it.
                <br />
                Track it.
                <br />
                <span className="text-accent">Get it fixed.</span>
              </h2>
              <p className="mt-6 text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
                A broken tap, a dark stairwell, a WiFi dead zone &mdash; log it in two minutes
                and follow it through to resolution.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/report" className="flex justify-center lg:justify-start">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                    Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={user ? "/dashboard" : "/auth"} className="flex justify-center lg:justify-start">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {user ? "Go to Dashboard" : "Sign In to View"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Signature element: a stamped work-order ticket */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-card border border-border shadow-sm w-full max-w-sm rotate-1">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dashed border-border">
                  <span className="font-mono text-xs text-muted-foreground">TICKET #2026-0417</span>
                  <span className="font-mono text-xs text-muted-foreground">JUL 29</span>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-display font-bold text-foreground text-lg leading-snug">
                    Flickering light &mdash; Library, 2nd Floor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tube light near the reading hall entrance has been flickering for a week.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <MapPin className="h-3.5 w-3.5" />
                    Computer Centre &ndash; Library
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge className="bg-status-progress/15 text-status-progress border border-status-progress/30 font-mono uppercase text-[10px] tracking-wider">
                      In Progress
                    </Badge>
                    <div className="relative">
                      <div className="border-2 border-status-resolved text-status-resolved font-display font-bold text-xs uppercase tracking-wider px-3 py-1 -rotate-6">
                        Assigned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section — mirrors the real status flow, not generic feature cards */}
      <section className="py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">How it works</p>
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-foreground uppercase">Three stops, one ticket</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            <Card className="rounded-none border-0">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">STAGE 01</span>
                </div>
                <CardTitle className="flex items-center text-lg font-display uppercase">
                  <MessageSquare className="mr-2 h-5 w-5 text-accent" />
                  Reported
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Log the issue with a title, category, location, and a photo if you've got one.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-none border-0">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">STAGE 02</span>
                </div>
                <CardTitle className="flex items-center text-lg font-display uppercase">
                  <Users className="mr-2 h-5 w-5 text-status-progress" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Upvote issues that affect you and watch as facilities picks them up.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-none border-0">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">STAGE 03</span>
                </div>
                <CardTitle className="flex items-center text-lg font-display uppercase">
                  <TrendingUp className="mr-2 h-5 w-5 text-status-resolved" />
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Get notified the moment it's fixed, with a timestamp on the record.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-primary px-4">
        <div className="container mx-auto text-primary-foreground text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">Since launch</p>
          <h3 className="font-display font-bold text-2xl lg:text-3xl mb-8 uppercase">Campus-wide log</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-4 border-t-2 border-accent">
              <div className="font-mono text-4xl lg:text-5xl font-bold mb-1">120+</div>
              <p className="text-primary-foreground/60 font-mono text-sm uppercase tracking-wide">Issues Reported</p>
            </div>
            <div className="p-4 border-t-2 border-status-resolved">
              <div className="font-mono text-4xl lg:text-5xl font-bold mb-1">85+</div>
              <p className="text-primary-foreground/60 font-mono text-sm uppercase tracking-wide">Issues Resolved</p>
            </div>
            <div className="p-4 border-t-2 border-primary-foreground/40">
              <div className="font-mono text-4xl lg:text-5xl font-bold mb-1">500+</div>
              <p className="text-primary-foreground/60 font-mono text-sm uppercase tracking-wide">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <h3 className="font-display font-bold text-2xl lg:text-3xl text-foreground mb-4 uppercase">Something needs fixing?</h3>
          <p className="text-muted-foreground text-lg mb-8">Takes about two minutes. Facilities sees it the same day.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/report" className="flex justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">Report an Issue</Button>
            </Link>
            <Link to={user ? "/dashboard" : "/auth"} className="flex justify-center">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {user ? "Go to Dashboard" : "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 px-4 border-t border-accent">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-display font-bold text-lg uppercase">IGDTUW Civic Reporter</h4>
              <p className="text-primary-foreground/50 mt-2 font-mono text-sm">Facilities &amp; Maintenance Desk</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-center font-mono text-sm">
              <a href="#" className="hover:text-accent">Terms of Service</a>
              <a href="#" className="hover:text-accent">Privacy Policy</a>
            </div>
          </div>
          <p className="text-center text-primary-foreground/40 font-mono text-xs">
            &copy; {new Date().getFullYear()} IGDTUW Civic Reporter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;