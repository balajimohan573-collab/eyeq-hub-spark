-- Create projects table for storing uploaded projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  github_link TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read projects
CREATE POLICY "Anyone can view projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert projects
CREATE POLICY "Anyone can create projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (true);

-- Create contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact submissions
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Create storage policies for project images
CREATE POLICY "Anyone can view project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Anyone can upload project images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'project-images');