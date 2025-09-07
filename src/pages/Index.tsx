import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageSquare, Users, TrendingUp, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";

const Index = () => {
  const { user } = useAuth();
  const { isAdmin, adminLogout } = useAdmin();

  const handleAdminLogout = () => {
    adminLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                IGDTUW Civic Reporter
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Mode
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAdminLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    Exit Admin
                  </Button>
                </div>
              )}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">Welcome, {user.email}</span>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="lg:flex lg:items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
                <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Report
                  </span>
                </span>
                <span className="text-slate-700 dark:text-slate-300">, </span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-100">
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Resolve
                  </span>
                </span>
                <span className="text-slate-700 dark:text-slate-300">, </span>
                <br />
                <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-200">
                  <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                    Improve
                  </span>
                </span>
                <span className="text-slate-700 dark:text-slate-300"> Our </span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-300">
                  <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent font-black">
                    Campus
                  </span>
                </span>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-300 text-lg">
                Be a part of the change. Report issues, track progress, and contribute to a better campus environment for everyone.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/report">
                  <Button size="lg">
                    Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={user ? "/dashboard" : "/auth"}>
                  <Button variant="outline" size="lg">
                    {user ? "Go to Dashboard" : "Sign In to View"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <img
                    src="/igdtuw.jpeg"
                    alt="Campus Illustration"
                    className="w-full rounded-xl shadow-2xl transform transition duration-500 hover:scale-105 hover:rotate-1 border-4 border-white/20 backdrop-blur-sm"
                    style={{
                      filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Key Features</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">Explore the features that make our platform effective and user-friendly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Easy Issue Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Report issues in just a few steps with our intuitive form. Add details, location, and even photos.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Users className="mr-2 h-5 w-5 text-green-500" />
                  Community Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Upvote issues, leave comments, and follow progress. Work together to prioritize and resolve problems.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Track the status of reported issues from submission to resolution. Stay informed every step of the way.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Our Impact</h3>
          <p className="text-lg mb-8">See the difference we're making together.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-5xl font-extrabold mb-2">120+</div>
              <p className="text-slate-200">Issues Reported</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">85+</div>
              <p className="text-slate-200">Issues Resolved</p>
            </div>
            <div>
              <div className="text-5xl font-extrabold mb-2">500+</div>
              <p className="text-slate-200">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to Make a Difference?</h3>
          <p className="text-slate-700 dark:text-slate-300 text-lg mb-8">Join our community and help us create a better campus for everyone.</p>
          <div className="flex justify-center gap-4">
            <Link to="/report">
              <Button size="lg">Report an Issue</Button>
            </Link>
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button variant="outline" size="lg">
                {user ? "Go to Dashboard" : "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold">IGDTUW Civic Reporter</h4>
              <p className="text-slate-400 mt-2">Empowering students to improve our campus.</p>
            </div>
            <div className="space-x-4">
              <a href="#" className="hover:text-blue-400">Terms of Service</a>
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            </div>
          </div>
          <p className="text-center text-slate-500">
            &copy; {new Date().getFullYear()} IGDTUW Civic Reporter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;