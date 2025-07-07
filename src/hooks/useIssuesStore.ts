
import { useState, useEffect } from 'react';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  location: string;
  reportedBy: string;
  reportedDate: string;
  lastUpdated: string;
  comments: number;
}

const initialIssues: Issue[] = [
  {
    id: "ISS-001",
    title: "Broken water cooler in Block A",
    description: "The water cooler on the 2nd floor of Block A has been malfunctioning for the past week. Students are unable to access drinking water.",
    status: "In Progress",
    priority: "High",
    category: "Infrastructure & Maintenance",
    location: "Block A, 2nd Floor",
    reportedBy: "Anonymous",
    reportedDate: "2024-01-15",
    lastUpdated: "2024-01-16",
    comments: 3
  },
  {
    id: "ISS-002", 
    title: "Poor lighting in parking area",
    description: "The parking area behind the main building has insufficient lighting, making it unsafe during evening hours.",
    status: "Pending",
    priority: "Medium",
    category: "Safety & Security",
    location: "Main Building Parking",
    reportedBy: "student@igdtuw.ac.in",
    reportedDate: "2024-01-14",
    lastUpdated: "2024-01-14",
    comments: 1
  },
  {
    id: "ISS-003",
    title: "WiFi connectivity issues in Library",
    description: "Students are experiencing frequent disconnections and slow internet speeds in the library's reading areas.",
    status: "Resolved",
    priority: "High",
    category: "WiFi & Technology",
    location: "Central Library",
    reportedBy: "Anonymous",
    reportedDate: "2024-01-12",
    lastUpdated: "2024-01-15",
    comments: 7
  },
  {
    id: "ISS-004",
    title: "Cafeteria hygiene concerns",
    description: "Tables and food serving area need better cleaning protocols. Multiple students have raised concerns about cleanliness.",
    status: "Under Review",
    priority: "Medium",
    category: "Cleanliness & Hygiene",
    location: "Main Cafeteria",
    reportedBy: "hygiene.committee@igdtuw.ac.in",
    reportedDate: "2024-01-13",
    lastUpdated: "2024-01-14",
    comments: 5
  },
  {
    id: "ISS-005",
    title: "Broken laboratory equipment",
    description: "Computer Lab 3 has several non-functional systems affecting practical sessions for CS students.",
    status: "Assigned", 
    priority: "Critical",
    category: "Infrastructure & Maintenance",
    location: "Computer Lab 3, Block C",
    reportedBy: "faculty@igdtuw.ac.in",
    reportedDate: "2024-01-11",
    lastUpdated: "2024-01-16",
    comments: 2
  }
];

export const useIssuesStore = () => {
  const [issues, setIssues] = useState<Issue[]>(() => {
    const stored = localStorage.getItem('civic-issues');
    return stored ? JSON.parse(stored) : initialIssues;
  });

  useEffect(() => {
    localStorage.setItem('civic-issues', JSON.stringify(issues));
  }, [issues]);

  const addIssue = (newIssue: Omit<Issue, 'id' | 'reportedDate' | 'lastUpdated' | 'comments'>) => {
    const issue: Issue = {
      ...newIssue,
      id: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      reportedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      comments: 0
    };
    setIssues(prev => [issue, ...prev]);
    return issue;
  };

  const updateIssueStatus = (id: string, status: Issue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, status, lastUpdated: new Date().toISOString().split('T')[0] }
        : issue
    ));
  };

  const deleteIssue = (id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
  };

  const getStats = () => {
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length;
    const pendingIssues = issues.filter(issue => issue.status === 'Pending').length;
    const inProgressIssues = issues.filter(issue => ['In Progress', 'Assigned', 'Under Review'].includes(issue.status)).length;

    return {
      totalIssues,
      resolvedIssues,
      pendingIssues,
      inProgressIssues,
      activeUsers: Math.floor(totalIssues * 0.7) // Simulated active users
    };
  };

  return {
    issues,
    addIssue,
    updateIssueStatus,
    deleteIssue,
    getStats
  };
};
