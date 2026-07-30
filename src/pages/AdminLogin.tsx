import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { adminLogin } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    adminId: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.adminId || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await adminLogin(formData.adminId, formData.password);
      
      if (success) {
        toast({
          title: "Admin Access Granted",
          description: "You are now logged in as college administration.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials. Please check your Admin ID and password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-accent mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-destructive mb-2">
              Restricted Access
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground uppercase">
              College Administration
            </h1>
            <p className="text-muted-foreground mt-2">
              Access the admin panel to respond to student issues
            </p>
          </div>
        </div>

        <Card className="border-t-2 border-t-destructive">
          <CardHeader>
            <CardTitle className="text-destructive font-display uppercase">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the administration panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminId"
                    placeholder="Enter admin ID"
                    className="pl-10"
                    value={formData.adminId}
                    onChange={(e) => handleInputChange("adminId", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground" 
                size="lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-status-pending/10 border border-status-pending/30">
              <p className="text-sm text-foreground">
                <strong className="font-mono uppercase text-xs tracking-wide text-status-pending">Note</strong>
                <br />
                This is a secure admin portal for college administration only. 
                Unauthorized access attempts are logged.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;