-- Create gallery_images table for storing gallery photos with descriptions
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  category VARCHAR(100), -- 'event', 'project', 'memory', etc.
  is_published BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published images
CREATE POLICY "Anyone can view published gallery images"
  ON gallery_images FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can insert (for future upload feature)
CREATE POLICY "Authenticated users can upload images"
  ON gallery_images FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can only update their own images
CREATE POLICY "Users can update their own images"
  ON gallery_images FOR UPDATE
  USING (uploader_id = auth.uid())
  WITH CHECK (uploader_id = auth.uid());

-- Policy: Users can only delete their own images
CREATE POLICY "Users can delete their own images"
  ON gallery_images FOR DELETE
  USING (uploader_id = auth.uid());

-- Create index for better query performance
CREATE INDEX idx_gallery_images_published ON gallery_images(is_published);
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_created_at ON gallery_images(created_at DESC);
