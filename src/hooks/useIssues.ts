
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
}

export const useIssues = () => {
  // ... keep existing code (state variables and useAuth)
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
        .order('reported_date', { ascending: false });

      if (error) {
        throw error;
      }

      // The data from Supabase already matches our Issue interface
      setIssues(data as Issue[]);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... keep existing code (updateIssueStatus, deleteIssue, getStats, useEffect, and return statement)
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
    refetch: fetchIssues
  };
};
