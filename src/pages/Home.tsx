import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Calendar, Users, ArrowRight, Plus, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    event_date: "",
  });
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const uploadEventMutation = useMutation({
    mutationFn: async () => {
      if (!eventImageFile) throw new Error("No image selected");

      const fileExt = eventImageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, eventImageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("events").insert({
        title: eventFormData.title,
        description: eventFormData.description,
        event_date: eventFormData.event_date,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event uploaded successfully!");
      setEventFormData({ title: "", description: "", event_date: "" });
      setEventImageFile(null);
      setEventImagePreview("");
      setShowEventForm(false);
    },
    onError: (error) => {
      toast.error("Failed to upload event: " + error.message);
    },
  });

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventImageFile || !eventFormData.title || !eventFormData.event_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    uploadEventMutation.mutate();
  };

  const members = [
    { name: "Sarah Chen", role: "President", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { name: "Marcus Johnson", role: "Vice President", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
    { name: "Aisha Patel", role: "Technical Lead", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha" },
    { name: "David Kim", role: "Events Coordinator", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
    { name: "Emma Rodriguez", role: "Communications", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  EyeQ Club
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Where vision meets innovation. Join a community of creators building the future.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/projects">
                  <Button size="lg" className="group">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">About EyeQ Club</h2>
              <p className="text-lg text-muted-foreground">
                EyeQ Club is more than just a tech community – we're a collective of innovators, 
                creators, and problem solvers passionate about building meaningful solutions. 
                Through collaborative projects, workshops, and events, we empower our members to 
                turn their ideas into reality and make a lasting impact.
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Events & Activities</h2>
              <p className="text-lg text-muted-foreground">
                Join us for exciting events and learning opportunities
              </p>
              <Button
                onClick={() => setShowEventForm(!showEventForm)}
                className="mt-4"
                size="lg"
              >
                {showEventForm ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </>
                )}
              </Button>
            </div>

            {showEventForm && (
              <Card className="max-w-2xl mx-auto mb-12">
                <CardContent className="p-6">
                  <form onSubmit={handleEventSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title *</Label>
                      <Input
                        id="event-title"
                        value={eventFormData.title}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, title: e.target.value })
                        }
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea
                        id="event-description"
                        value={eventFormData.description}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, description: e.target.value })
                        }
                        placeholder="Describe your event"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date *</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventFormData.event_date}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, event_date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-image">Event Image *</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="event-image"
                          type="file"
                          accept="image/*"
                          onChange={handleEventImageChange}
                          className="flex-1"
                          required
                        />
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {eventImagePreview && (
                        <img
                          src={eventImagePreview}
                          alt="Preview"
                          className="mt-4 rounded-lg max-h-48 object-cover"
                        />
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={uploadEventMutation.isPending}
                    >
                      {uploadEventMutation.isPending ? "Uploading..." : "Upload Event"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {eventsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading events...</p>
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <p className="text-sm text-primary">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {new Date(event.event_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {event.description && (
                        <p className="text-muted-foreground text-sm">
                          {event.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No events yet. Add your first event!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Members Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Our Members</h2>
              <p className="text-lg text-muted-foreground">
                Meet the people driving innovation at EyeQ Club
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {members.map((member, index) => (
                <Card key={index} className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
