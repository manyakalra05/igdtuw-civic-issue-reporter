import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MapComponent from "@/components/MapComponent";

const ReportIssue = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const categories = [
    "Infrastructure & Maintenance",
    "Safety & Security",
    "WiFi & Technology",
    "Cleanliness & Hygiene",
    "Transportation",
    "Cafeteria & Food Services",
    "Library & Academic Resources",
    "Sports & Recreation",
    "Other",
  ];

  const priorities = ["Low", "Medium", "High", "Critical"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    setFormData((prev) => ({ ...prev, location: address }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to report an issue.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("issues")
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          location: formData.location || "Not specified",
          contact_email: formData.contactEmail || user.email,
          contact_phone: formData.contactPhone,
          latitude: selectedLocation?.lat || null,
          longitude: selectedLocation?.lng || null,
          status: "Reported",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Issue Reported Successfully!",
        description: `Your issue has been submitted and will be reviewed by our team.`,
      });

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        image: null,
      });
      setSelectedLocation(null);

      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting issue:", error);
      toast({
        title: "Error Submitting Issue",
        description: error.message || "There was an error submitting your issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Report a Campus Issue</h1>
          <p className="text-gray-600 mt-2">
            Help us improve IGDTUW by reporting any issues you encounter on campus.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Select Location on Map</CardTitle>
                <CardDescription>
                  Click on the map to pinpoint the exact location of the issue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px] mx-auto">
                    <MapComponent
                      onLocationSelect={handleLocationSelect}
                      className="w-full h-[400px] rounded-lg"
                    />
                  </div>
                </div>
                {selectedLocation && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Location Selected</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{selectedLocation.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us address your concern effectively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => handleInputChange("category", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select onValueChange={(value) => handleInputChange("priority", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location Description</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="e.g., Block A, 2nd Floor, Room 205"
                        className="pl-10"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Auto-filled when you select on map, or type manually.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the issue in detail..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-gray-900">Click to upload</span>
                          <span className="block text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                      {formData.image && (
                        <p className="mt-2 text-sm text-green-600">Selected: {formData.image.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="your.email@igdtuw.ac.in"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Issue Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
