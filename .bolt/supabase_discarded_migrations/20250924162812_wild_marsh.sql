/*
  # Add Plan Management System

  1. New Columns
    - `image_plan` (text, default 'free') - Current image generation plan
    - `video_plan` (text, default 'free') - Current video generation plan

  2. New Functions
    - `update_user_plan` - Updates user's image or video plan
    - Maintains existing credit management functions

  3. Security
    - Users can only update their own plans
    - Plan validation to ensure valid plan types
*/

-- Add plan columns to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'image_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN image_plan text DEFAULT 'free';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'video_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN video_plan text DEFAULT 'free';
  END IF;
END $$;

-- Create or replace the plan update function
CREATE OR REPLACE FUNCTION update_user_plan(
  user_id uuid,
  plan_type text,
  plan_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated and updating their own data
  IF auth.uid() IS NULL OR auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Validate plan_type
  IF plan_type NOT IN ('image', 'video') THEN
    RAISE EXCEPTION 'Invalid plan type. Must be image or video';
  END IF;

  -- Update the appropriate plan
  IF plan_type = 'image' THEN
    UPDATE user_profiles 
    SET 
      image_plan = plan_id,
      updated_at = now()
    WHERE id = user_id;
  ELSE
    UPDATE user_profiles 
    SET 
      video_plan = plan_id,
      updated_at = now()
    WHERE id = user_id;
  END IF;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_plan(uuid, text, text) TO authenticated;

-- Ensure existing credit functions exist
CREATE OR REPLACE FUNCTION update_user_credits(
  user_id uuid,
  credit_change integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_credits integer;
BEGIN
  -- Check if user is authenticated and updating their own data
  IF auth.uid() IS NULL OR auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update credits and return new value
  UPDATE user_profiles 
  SET 
    credits = GREATEST(0, credits + credit_change),
    updated_at = now()
  WHERE id = user_id
  RETURNING credits INTO new_credits;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_credits;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_video_credits(
  user_id uuid,
  credit_change integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_credits integer;
BEGIN
  -- Check if user is authenticated and updating their own data
  IF auth.uid() IS NULL OR auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update video credits and return new value
  UPDATE user_profiles 
  SET 
    video_credits = GREATEST(0, video_credits + credit_change),
    updated_at = now()
  WHERE id = user_id
  RETURNING video_credits INTO new_credits;

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_credits;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user_credits(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_video_credits(uuid, integer) TO authenticated;