/*
  # Fix Video Credits and Plan Management

  1. Database Updates
    - Add video_credits column if not exists
    - Add plan column updates
    - Create video credit management function
    - Update user profile structure

  2. Functions
    - Video credit update function
    - Plan management functions
*/

-- Add video_credits column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'video_credits'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN video_credits integer DEFAULT 0;
  END IF;
END $$;

-- Update plan column to allow multiple values
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'plan'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_plan_check;
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_plan_check 
    CHECK (plan = ANY (ARRAY['free'::text, 'starter'::text, 'pro'::text, 'premium'::text, 'video'::text]));
  END IF;
END $$;

-- Add image_plan and video_plan columns for separate plan tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'image_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN image_plan text DEFAULT 'free';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'video_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN video_plan text DEFAULT 'none';
  END IF;
END $$;

-- Create or replace video credit update function
CREATE OR REPLACE FUNCTION update_user_video_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_credits integer;
BEGIN
  UPDATE user_profiles 
  SET video_credits = GREATEST(0, video_credits + credit_change),
      updated_at = now()
  WHERE id = user_id
  RETURNING video_credits INTO new_credits;
  
  IF new_credits IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  RETURN new_credits;
END;
$$;

-- Create or replace plan update function
CREATE OR REPLACE FUNCTION update_user_plan(user_id uuid, plan_type text, plan_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF plan_type = 'image' THEN
    UPDATE user_profiles 
    SET image_plan = plan_name,
        updated_at = now()
    WHERE id = user_id;
  ELSIF plan_type = 'video' THEN
    UPDATE user_profiles 
    SET video_plan = plan_name,
        updated_at = now()
    WHERE id = user_id;
  END IF;
END;
$$;

-- Create or replace cancel plan function
CREATE OR REPLACE FUNCTION cancel_user_plan(user_id uuid, plan_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF plan_type = 'image' THEN
    UPDATE user_profiles 
    SET image_plan = 'free',
        updated_at = now()
    WHERE id = user_id;
  ELSIF plan_type = 'video' THEN
    UPDATE user_profiles 
    SET video_plan = 'none',
        updated_at = now()
    WHERE id = user_id;
  END IF;
END;
$$;