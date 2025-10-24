import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Github, Upload, Plus, X, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Projects = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!imageFile) throw new Error("No image selected");

      // Upload image to storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      // Insert project record
      const { error: insertError } = await supabase.from("projects").insert({
        title: formData.title,
        description: formData.description,
        image_url: publicUrl,
        github_link: formData.github_link,
      });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project uploaded successfully!");
      setFormData({ title: "", description: "", github_link: "" });
      setImageFile(null);
      setImagePreview("");
      setShowUploadForm(false);
    },
    onError: (error) => {
      toast.error("Failed to upload project: " + error.message);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !formData.title || !formData.github_link) {
      toast.error("Please fill in all required fields");
      return;
    }
    uploadMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
      setDeleteProjectId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete project: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = editingProject.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: formData.title,
          description: formData.description,
          github_link: formData.github_link,
          image_url: imageUrl,
        })
        .eq("id", editingProject.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
      setShowEditDialog(false);
      setEditingProject(null);
      setFormData({ title: "", description: "", github_link: "" });
      setImageFile(null);
      setImagePreview("");
    },
    onError: (error) => {
      toast.error("Failed to update project: " + error.message);
    },
  });

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      github_link: project.github_link,
    });
    setImagePreview(project.image_url);
    setShowEditDialog(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.github_link) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Our Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the innovative projects built by EyeQ Club members
            </p>
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="mt-4"
              size="lg"
            >
              {showUploadForm ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Upload Project
                </>
              )}
            </Button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <Card className="max-w-2xl mx-auto mb-12">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Describe your project"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Repository *</Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.github_link}
                      onChange={(e) =>
                        setFormData({ ...formData, github_link: e.target.value })
                      }
                      placeholder="https://github.com/username/repo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Project Image *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                        required
                      />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 rounded-lg max-h-48 object-cover"
                      />
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Project"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:underline"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        View on GitHub
                      </a>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteProjectId(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No projects yet. Be the first to upload!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Project Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your project"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-github">GitHub Repository *</Label>
              <Input
                id="edit-github"
                type="url"
                value={formData.github_link}
                onChange={(e) =>
                  setFormData({ ...formData, github_link: e.target.value })
                }
                placeholder="https://github.com/username/repo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Project Image (optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Project"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectId && deleteMutation.mutate(deleteProjectId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
