
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues } from "@/hooks/useIssues";
import { useEffect } from "react";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { getStats, issues } = useIssues();
  
  const stats = getStats();

  const handleSignOut = async () => {
    await signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">IGDTUW Civic Reporter</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Link to="/dashboard">
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Make Your Campus
            <span className="text-blue-600 block">Better Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Report campus issues, track their progress, and help create a better learning environment for everyone at IGDTUW.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/report">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Report an Issue
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    View Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Started
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <AlertTriangle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalIssues}</h3>
              <p className="text-gray-600">Total Issues Reported</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.resolvedIssues}</h3>
              <p className="text-gray-600">Issues Resolved</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.inProgressIssues}</h3>
              <p className="text-gray-600">In Progress</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.activeUsers}</h3>
              <p className="text-gray-600">Active Users</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                Easy Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quickly report any campus issues with our intuitive form. Add photos, location details, and priority levels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
                Real-time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track the progress of your reported issues in real-time. Get updates as issues move through different stages.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                Community Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join a community of students and staff working together to improve our campus environment.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Issues */}
        {issues.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Latest issues reported by the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{issue.title}</h4>
                      <p className="text-sm text-gray-600">{issue.category} • {issue.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {issue.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(issue.reported_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {user && (
                <div className="mt-6 text-center">
                  <Link to="/dashboard">
                    <Button variant="outline">View All Issues</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {!user && (
          <Card className="text-center bg-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-blue-100 mb-6">
                Sign up today and start reporting issues to help improve our campus community.
              </p>
              <Link to="/auth">
                <Button variant="secondary" size="lg">
                  Sign Up Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
