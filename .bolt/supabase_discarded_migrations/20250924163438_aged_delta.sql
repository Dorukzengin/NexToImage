/*
  # Add missing plan columns to user_profiles table

  1. New Columns
    - `image_plan` (text, default 'free') - User's current image generation plan
    - `video_plan` (text, default 'free') - User's current video generation plan

  2. Updates
    - Add columns with proper defaults
    - Update existing users to have 'free' plans
    - Add check constraints for valid plan values

  3. Security
    - Maintain existing RLS policies
    - No additional security changes needed
*/

-- Add image_plan column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'image_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN image_plan text DEFAULT 'free';
  END IF;
END $$;

-- Add video_plan column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'video_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN video_plan text DEFAULT 'free';
  END IF;
END $$;

-- Update existing users to have 'free' plans if they don't have values
UPDATE user_profiles 
SET image_plan = 'free' 
WHERE image_plan IS NULL;

UPDATE user_profiles 
SET video_plan = 'free' 
WHERE video_plan IS NULL;

-- Add check constraints for valid plan values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_image_plan_check'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_image_plan_check 
    CHECK (image_plan IN ('free', 'starter', 'pro', 'premium'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_video_plan_check'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_video_plan_check 
    CHECK (video_plan IN ('free', 'video-starter'));
  END IF;
END $$;