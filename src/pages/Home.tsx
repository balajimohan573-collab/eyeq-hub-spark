import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Users, Code, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const events = [
    {
      title: "Web Development Workshop",
      date: "March 15, 2025",
      description: "Learn modern web development with React and TypeScript",
      icon: Code,
    },
    {
      title: "Hackathon 2025",
      date: "April 20-21, 2025",
      description: "24-hour coding challenge to build innovative solutions",
      icon: Calendar,
    },
    {
      title: "Tech Talk Series",
      date: "Every Friday",
      description: "Weekly sessions with industry experts and alumni",
      icon: Users,
    },
  ];

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
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Card key={index} className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <event.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-primary mb-3">{event.date}</p>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
