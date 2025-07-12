import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  reported_date: string;
  updated_at: string;
  user_id: string | null;
  latitude: number | null;
  longitude: number | null;
  upvote_count: number;
}

export interface IssueResponse {
  id: string;
  issue_id: string;
  user_id: string | null;
  response_text: string;
  response_type: string;
  created_at: string;
  updated_at: string;
  is_admin_response?: boolean; // Add this field if you want to track admin responses
}

export interface StatusHistory {
  id: string;
  issue_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  change_reason: string | null;
  created_at: string;
}

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('upvote_count', { ascending: false })
        .order('reported_date', { ascending: false });

      if (error) {
        throw error;
      }

      setIssues((data as Issue[]) || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpvote = async (issueId: string) => {
    if (!user) return;

    try {
      // Check if user has already upvoted
      const { data: existingUpvote, error: fetchError } = await supabase
        .from('issue_upvotes' as any)
        .select('id')
        .eq('issue_id', issueId)
        .eq('user_id', user.id)
        .maybeSingle() as any;

      if (fetchError) throw fetchError;

      if (existingUpvote) {
        // Remove upvote
        const { error } = await supabase
          .from('issue_upvotes' as any)
          .delete()
          .eq('id', existingUpvote.id) as any;

        if (error) throw error;
      } else {
        // Add upvote
        const { error } = await supabase
          .from('issue_upvotes' as any)
          .insert([{
            issue_id: issueId,
            user_id: user.id
          }]) as any;

        if (error) throw error;
      }

      // Refresh issues to get updated count
      await fetchIssues();
    } catch (err: any) {
      console.error('Error toggling upvote:', err);
      setError(err.message);
    }
  };

  const checkUserUpvote = async (issueId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('issue_upvotes' as any)
        .select('id')
        .eq('issue_id', issueId)
        .eq('user_id', user.id)
        .maybeSingle() as any;

      if (error) throw error;
      return !!data;
    } catch {
      return false;
    }
  };

  // FIXED: Modified addResponse to handle admin responses
  const addResponse = async (
    issueId: string, 
    responseText: string, 
    responseType: string = 'update', 
    isAdmin: boolean = false
  ) => {
    // Allow admin responses even without user authentication
    if (!user && !isAdmin) {
      throw new Error('Authentication required');
    }

    try {
      console.log('Adding response:', {
        issueId,
        responseText,
        responseType,
        isAdmin,
        userId: user?.id
      });

      const responseData = {
        issue_id: issueId,
        user_id: user?.id || null, // Allow null for admin responses
        response_text: responseText,
        response_type: responseType,
        is_admin_response: isAdmin // Add this if your table has this column
      };

      const { data, error } = await supabase
        .from('issue_responses' as any)
        .insert([responseData]) as any;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Response added successfully:', data);
      return data;
    } catch (err: any) {
      console.error('Error adding response:', err);
      throw err; // Re-throw to be caught by the component
    }
  };

  const getIssueResponses = async (issueId: string): Promise<IssueResponse[]> => {
    try {
      const { data, error } = await supabase
        .from('issue_responses' as any)
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: false }) as any;

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching responses:', err);
      return [];
    }
  };

  const getStatusHistory = async (issueId: string): Promise<StatusHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('issue_status_history' as any)
        .select('*')
        .eq('issue_id', issueId)
        .order('created_at', { ascending: false }) as any;

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching status history:', err);
      return [];
    }
  };

  const updateIssueStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setIssues(prev => prev.map(issue => 
        issue.id === id 
          ? { ...issue, status, updated_at: new Date().toISOString() }
          : issue
      ));
    } catch (err: any) {
      console.error('Error updating issue status:', err);
      setError(err.message);
    }
  };

  const deleteIssue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setIssues(prev => prev.filter(issue => issue.id !== id));
    } catch (err: any) {
      console.error('Error deleting issue:', err);
      setError(err.message);
    }
  };

  const getStats = () => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length;
    const reportedIssues = issues.filter(issue => issue.status === 'Reported').length;
    const inProgressIssues = issues.filter(issue => 
      ['In Progress', 'Assigned', 'Under Review'].includes(issue.status)
    ).length;

    return {
      totalIssues,
      resolvedIssues,
      pendingIssues: reportedIssues,
      inProgressIssues,
      activeUsers: Math.floor(totalIssues * 0.7) // Estimated based on issues
    };
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    error,
    updateIssueStatus,
    deleteIssue,
    getStats,
    refetch: fetchIssues,
    toggleUpvote,
    checkUserUpvote,
    addResponse,
    getIssueResponses,
    getStatusHistory
  };
};