import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Clock, User, MessageSquare, Shield, History } from "lucide-react";
import { Issue, IssueResponse, StatusHistory, useIssues } from "@/hooks/useIssues";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface IssueDetailsModalProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

export const IssueDetailsModal = ({ issue, open, onOpenChange, isAdmin = false }: IssueDetailsModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { addResponse, getIssueResponses, getStatusHistory } = useIssues();
  
  const [responses, setResponses] = useState<IssueResponse[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [newResponse, setNewResponse] = useState("");
  const [responseType, setResponseType] = useState("update");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"responses" | "history">("responses");

  useEffect(() => {
    if (issue && open) {
      loadIssueData();
    }
  }, [issue, open]);

  const loadIssueData = async () => {
    if (!issue) return;
    
    try {
      const [responsesData, historyData] = await Promise.all([
        getIssueResponses(issue.id),
        getStatusHistory(issue.id)
      ]);
      
      console.log('Loaded responses:', responsesData);
      setResponses(responsesData);
      setStatusHistory(historyData);
    } catch (error) {
      console.error('Error loading issue data:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!newResponse.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a response message.",
        variant: "destructive"
      });
      return;
    }

    if (!user && !isAdmin) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add responses.",
        variant: "destructive"
      });
      return;
    }

    if (!issue) {
      toast({
        title: "Error",
        description: "Issue not found.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the response
      const newResponseData = await addResponse(issue.id, newResponse, responseType, isAdmin);
      
      // Clear the form
      setNewResponse("");
      setResponseType("update");
      
      // FIXED: Directly update the local state instead of using setTimeout
      if (newResponseData && newResponseData.length > 0) {
        const addedResponse = newResponseData[0];
        setResponses(prevResponses => [addedResponse, ...prevResponses]);
      } else {
        // Fallback: Create the response object manually if return data structure is different
        const newResponseObj: IssueResponse = {
          id: Date.now().toString(), // Temporary ID
          issue_id: issue.id,
          user_id: user?.id || null,
          response_text: newResponse,
          response_type: responseType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_admin_response: isAdmin
        };
        setResponses(prevResponses => [newResponseObj, ...prevResponses]);
      }
      
      toast({
        title: "Response Added",
        description: isAdmin ? "Admin response has been added successfully." : "Your response has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: "Error",
        description: "Failed to add response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!issue) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">{issue.title}</DialogTitle>
              <DialogDescription className="text-base">{issue.description}</DialogDescription>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <Badge className={statusColors[issue.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                {issue.status}
              </Badge>
              <Badge className={priorityColors[issue.priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}>
                {issue.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{issue.location}</span>
                  {issue.latitude && issue.longitude && (
                    <Badge variant="outline" className="ml-2 text-xs">Mapped</Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Reported: {format(new Date(issue.reported_date), 'PPP')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Updated: {format(new Date(issue.updated_at), 'PPp')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>Category: {issue.category}</span>
                </div>
              </div>
              
              {issue.contact_email && (
                <div className="text-sm text-gray-600">
                  <strong>Contact:</strong> {issue.contact_email}
                  {issue.contact_phone && ` • ${issue.contact_phone}`}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("responses")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "responses"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Responses ({responses.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "history"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              Status History ({statusHistory.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "responses" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Responses & Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {responses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No responses yet.</p>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {responses.map((response) => {
                      const isAdminResponse = response.is_admin_response || response.user_id === null;
                      return (
                        <div 
                          key={response.id} 
                          className={`border-l-4 pl-4 py-2 ${
                            isAdminResponse ? 'border-red-500 bg-red-50' : 'border-blue-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {response.response_type === 'update' ? 'Update' : 
                                 response.response_type === 'resolution' ? 'Resolution' : 'Comment'}
                              </Badge>
                              {isAdminResponse && (
                                <Badge variant="destructive" className="text-xs bg-red-100 text-red-800">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(new Date(response.created_at), 'PPp')}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            isAdminResponse ? 'text-red-800 font-medium' : 'text-gray-700'
                          }`}>
                            {response.response_text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Response Form */}
                {(user || isAdmin) && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      {isAdmin && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin Response
                        </Badge>
                      )}
                      <Select value={responseType} onValueChange={setResponseType}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="update">Status Update</SelectItem>
                          <SelectItem value="resolution">Resolution</SelectItem>
                          <SelectItem value="comment">Comment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      placeholder={isAdmin ? "Add an official response from college administration..." : "Add your response or comment..."}
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      rows={3}
                    />
                    
                    <Button 
                      onClick={handleSubmitResponse}
                      disabled={isSubmitting || !newResponse.trim()}
                      className={isAdmin ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isSubmitting ? "Adding Response..." : 
                       isAdmin ? "Add Admin Response" : "Add Response"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status History</CardTitle>
              </CardHeader>
              <CardContent>
                {statusHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No status changes yet.</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {statusHistory.map((history) => (
                      <div key={history.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {history.old_status && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  {history.old_status}
                                </Badge>
                                <span className="text-gray-400">→</span>
                              </>
                            )}
                            <Badge className={statusColors[history.new_status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                              {history.new_status}
                            </Badge>
                          </div>
                          {history.change_reason && (
                            <p className="text-xs text-gray-600 mt-1">{history.change_reason}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(history.created_at), 'PPp')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};