
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Eye, Trash2, Users, AlertTriangle, CheckCircle, Clock, MapPin, ThumbsUp, MessageSquare, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useIssues } from "@/hooks/useIssues";
import { IssueDetailsModal } from "@/components/IssueDetailsModal";
import MapComponent from "@/components/MapComponent";

const Dashboard = () => {
  // ... keep existing code (state declarations and effects)

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, adminLogout } = useAdmin();
  const { issues, loading, error, updateIssueStatus, deleteIssue, getStats, toggleUpvote, checkUserUpvote } = useIssues();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());

  // Redirect to auth if not logged in and not admin
  useEffect(() => {
    if (!authLoading && !user && !isAdmin) {
      navigate('/auth');
    }
  }, [user, authLoading, isAdmin, navigate]);

  // Load user upvotes
  useEffect(() => {
    const loadUserUpvotes = async () => {
      if (!user) return;
      
      const upvotedIssues = new Set<string>();
      for (const issue of issues) {
        const hasUpvoted = await checkUserUpvote(issue.id);
        if (hasUpvoted) {
          upvotedIssues.add(issue.id);
        }
      }
      setUserUpvotes(upvotedIssues);
    };

    if (issues.length > 0) {
      loadUserUpvotes();
    }
  }, [issues, user, checkUserUpvote]);

  const handleSignOut = async () => {
    if (isAdmin) {
      adminLogout();
    }
    if (user) {
      await signOut();
    }
    navigate('/');
  };

  const handleStatusUpdate = async (issueId: string, newStatus: string) => {
    await updateIssueStatus(issueId, newStatus);
    toast({
      title: "Status Updated",
      description: "Issue status has been updated successfully.",
    });
  };

  const handleDeleteIssue = async (issueId: string) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      await deleteIssue(issueId);
      toast({
        title: "Issue Deleted",
        description: "The issue has been deleted successfully.",
      });
    }
  };

  const handleUpvote = async (issueId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upvote issues.",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleUpvote(issueId);
      
      // Update local upvote state
      const newUpvotes = new Set(userUpvotes);
      if (userUpvotes.has(issueId)) {
        newUpvotes.delete(issueId);
        toast({
          title: "Upvote Removed",
          description: "You removed your upvote from this issue.",
        });
      } else {
        newUpvotes.add(issueId);
        toast({
          title: "Issue Upvoted",
          description: "You upvoted this issue to increase its visibility.",
        });
      }
      setUserUpvotes(newUpvotes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update upvote. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || issue.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Get unique categories from issues
  const categories = [...new Set(issues.map(issue => issue.category))];

  const stats = getStats();

  const statusColors = {
    "Reported": "bg-yellow-100 text-yellow-800",
    "Under Review": "bg-blue-100 text-blue-800", 
    "Assigned": "bg-purple-100 text-purple-800",
    "In Progress": "bg-orange-100 text-orange-800",
    "Resolved": "bg-green-100 text-green-800"
  };

  const priorityColors = {
    "Low": "bg-gray-100 text-gray-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "High": "bg-orange-100 text-orange-800",
    "Critical": "bg-red-100 text-red-800"
  };

  // Convert issues to map pins using actual stored coordinates
  const mapPins = issues
    .filter(issue => issue.latitude && issue.longitude)
    .map(issue => ({
      id: issue.id,
      lat: issue.latitude!,
      lng: issue.longitude!,
      title: issue.title,
      description: issue.description,
      type: 'issue' as const
    }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Issues Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Mode
                </Badge>
              )}
              {user && <span className="text-sm text-gray-600">Welcome, {user.email}</span>}
              {isAdmin && !user && <span className="text-sm text-gray-600">College Administration</span>}
              <Button variant="outline" onClick={handleSignOut}>
                {isAdmin ? "Exit Admin" : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... keep existing code (Stats Cards) */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Issues</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgressIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolvedIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link to="/report">
            <Button>Report New Issue</Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>

        {/* ... keep existing code (Map section) */}

        {showMap && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Campus Issues Map</CardTitle>
              <CardDescription>
                Visual representation of reported issues across campus
                {mapPins.length === 0 && " (No issues with location data to display)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapComponent pins={mapPins} className="w-full" />
              {mapPins.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No issues with location data to display on the map.</p>
                  <p className="text-sm">Issues reported with map selection will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ... keep existing code (Filters section) */}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Issues Found</h3>
                <p className="text-gray-600">
                  {issues.length === 0 
                    ? "No issues have been reported yet." 
                    : "No issues match your current filters."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        <Badge className={statusColors[issue.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                          {issue.status}
                        </Badge>
                        <Badge className={priorityColors[issue.priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}>
                          {issue.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{issue.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {issue.location}
                          {issue.latitude && issue.longitude && (
                            <span className="ml-1 text-green-600">(📍Mapped)</span>
                          )}
                        </span>
                        <span>Category: {issue.category}</span>
                        <span>Reported: {new Date(issue.reported_date).toLocaleDateString()}</span>
                        {issue.contact_email && (
                          <span>Contact: {issue.contact_email}</span>
                        )}
                      </div>

                      {/* Community Actions */}
                      <div className="flex items-center space-x-4">
                        <Button
                          variant={userUpvotes.has(issue.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpvote(issue.id)}
                          className="flex items-center space-x-1"
                          disabled={!user && !isAdmin}
                        >
                          <ThumbsUp className={`h-4 w-4 ${userUpvotes.has(issue.id) ? 'fill-current' : ''}`} />
                          <span>{issue.upvote_count || 0}</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIssue(issue)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {/* Show status update dropdown only for regular users who own the issue */}
                      {(!isAdmin && user && user.id === issue.user_id) && (
                        <Select
                          value={issue.status}
                          onValueChange={(value) => handleStatusUpdate(issue.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Reported">Reported</SelectItem>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Assigned">Assigned</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      {/* Show delete button only for regular users who own the issue, NOT for admins */}
                      {(!isAdmin && user && user.id === issue.user_id) && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteIssue(issue.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal
        issue={selectedIssue}
        open={!!selectedIssue}
        onOpenChange={(open) => {
          if (!open) setSelectedIssue(null);
        }}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Dashboard;
