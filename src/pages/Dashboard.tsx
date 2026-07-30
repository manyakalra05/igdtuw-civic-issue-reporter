import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Eye, Trash2, Users, AlertTriangle, CheckCircle, Clock, MapPin, ThumbsUp, MessageSquare, Shield, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useIssues } from "@/hooks/useIssues";
import { IssueDetailsModal } from "@/components/IssueDetailsModal";
import MapComponent from "@/components/MapComponent";

const Dashboard = () => {
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

  const badgeBase = "font-mono uppercase text-[10px] tracking-wider border";

  const statusColors = {
    "Reported": `bg-status-pending/15 text-status-pending border-status-pending/30 ${badgeBase}`,
    "Under Review": `bg-status-review/15 text-status-review border-status-review/30 ${badgeBase}`,
    "Assigned": `bg-primary/10 text-primary border-primary/30 ${badgeBase}`,
    "In Progress": `bg-status-progress/15 text-status-progress border-status-progress/30 ${badgeBase}`,
    "Resolved": `bg-status-resolved/15 text-status-resolved border-status-resolved/30 ${badgeBase}`
  };

  const priorityColors = {
    "Low": `bg-secondary text-secondary-foreground border-border ${badgeBase}`,
    "Medium": `bg-status-pending/15 text-status-pending border-status-pending/30 ${badgeBase}`,
    "High": `bg-status-progress/15 text-status-progress border-status-progress/30 ${badgeBase}`,
    "Critical": `bg-destructive/15 text-destructive border-destructive/30 ${badgeBase}`
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-muted-foreground font-mono text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96 mx-4 border-t-2 border-t-destructive">
          <CardHeader>
            <CardTitle className="text-destructive font-display uppercase">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-accent hover:bg-accent/90 text-accent-foreground">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Responsive */}
      <header className="bg-primary border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-primary-foreground uppercase tracking-tight">Dashboard</h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Badge className="bg-accent text-accent-foreground border-0 font-mono uppercase text-[10px] tracking-wider self-start sm:self-auto">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin Mode
                </Badge>
              )}
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                {user && <span className="text-sm text-primary-foreground/60 font-mono truncate max-w-48">{user.email}</span>}
                {isAdmin && !user && <span className="text-sm text-primary-foreground/60 font-mono">College Administration</span>}
                <Button variant="outline" size="sm" onClick={handleSignOut} className="!bg-transparent !border-primary-foreground/30 !text-primary-foreground hover:!bg-primary-foreground/10 hover:!text-primary-foreground">
                  {isAdmin ? "Exit Admin" : "Sign Out"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-t-2 border-t-primary">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 sm:mb-0" />
                <div className="sm:ml-4">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wide text-muted-foreground">Total Issues</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">{stats.totalIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-2 border-t-status-pending">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-status-pending mb-2 sm:mb-0" />
                <div className="sm:ml-4">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wide text-muted-foreground">Pending</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">{stats.pendingIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-2 border-t-status-progress">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-status-progress mb-2 sm:mb-0" />
                <div className="sm:ml-4">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wide text-muted-foreground">In Progress</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">{stats.inProgressIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-2 border-t-status-resolved">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-status-resolved mb-2 sm:mb-0" />
                <div className="sm:ml-4">
                  <p className="text-xs sm:text-sm font-mono uppercase tracking-wide text-muted-foreground">Resolved</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-foreground">{stats.resolvedIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <Link to="/report" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">Report New Issue</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="w-full sm:w-auto"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>

        {/* Map Section */}
        {showMap && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="font-display uppercase">Campus Issues Map</CardTitle>
              <CardDescription>
                Visual representation of reported issues across campus
                {mapPins.length === 0 && " (No issues with location data to display)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapComponent pins={mapPins} className="w-full" />
              {mapPins.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                  <p>No issues with location data to display on the map.</p>
                  <p className="text-sm">Issues reported with map selection will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Filters - Mobile Responsive */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search - Full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filters - Stack on mobile, grid on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Issues List - Mobile Responsive */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-display font-medium text-foreground mb-2 uppercase">No Issues Found</h3>
                <p className="text-muted-foreground">
                  {issues.length === 0
                    ? "No issues have been reported yet."
                    : "No issues match your current filters."}
                </p>
              </CardContent>
            </Card>
            ) : (
            filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow border-l-2 border-l-transparent hover:border-l-accent">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-3">
                      <h3 className="text-lg font-display font-semibold text-foreground leading-tight break-words">{issue.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={statusColors[issue.status as keyof typeof statusColors] || `bg-secondary text-secondary-foreground border-border ${badgeBase}`}>
                          {issue.status}
                        </Badge>
                        <Badge className={priorityColors[issue.priority as keyof typeof priorityColors] || `bg-secondary text-secondary-foreground border-border ${badgeBase}`}>
                          {issue.priority}
                        </Badge>
                        {issue.image_url && (
                          <Badge variant="outline" className="text-xs">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-words">{issue.description}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground font-mono">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="break-words">
                          {issue.location}
                          {issue.latitude && issue.longitude && (
                            <span className="ml-1 text-status-resolved">(Mapped)</span>
                          )}
                        </span>
                      </div>
                      <div>Category: {issue.category}</div>
                      <div>Reported: {new Date(issue.reported_date).toLocaleDateString()}</div>
                      {issue.contact_email && (
                        <div className="break-words">Contact: {issue.contact_email}</div>
                      )}
                    </div>

                    {issue.image_url && (
                      <div className="w-full sm:max-w-xs">
                        <img
                          src={issue.image_url}
                          alt="Issue attachment"
                          className="w-full h-48 sm:h-32 object-cover border border-border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(issue.image_url!, '_blank')}
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-border">
                      <div className="flex items-center space-x-3">
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
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {(!isAdmin && user && user.id === issue.user_id) && (
                          <Select
                            value={issue.status}
                            onValueChange={(value) => handleStatusUpdate(issue.id, value)}
                          >
                            <SelectTrigger className="w-full sm:w-40">
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
                        
                        {(!isAdmin && user && user.id === issue.user_id) && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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