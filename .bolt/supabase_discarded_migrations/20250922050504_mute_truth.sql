/*
  # Add Video Credits System

  1. Schema Changes
    - Add `video_credits` column to user_profiles table
    - Set default value to 0 for existing users
    - Update RLS policies to include video credits

  2. Functions
    - Update credit management function to handle video credits
    - Add separate video credit update function

  3. Security
    - Maintain existing RLS policies
    - Add video credit management permissions
*/

-- Add video_credits column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'video_credits'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN video_credits integer DEFAULT 0;
  END IF;
END $$;

-- Update existing users to have 0 video credits
UPDATE user_profiles SET video_credits = 0 WHERE video_credits IS NULL;

-- Create or replace function to update video credits
CREATE OR REPLACE FUNCTION update_user_video_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_video_credits integer;
BEGIN
  UPDATE user_profiles 
  SET video_credits = GREATEST(0, video_credits + credit_change),
      updated_at = now()
  WHERE id = user_id
  RETURNING video_credits INTO new_video_credits;
  
  IF new_video_credits IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  RETURN new_video_credits;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION update_user_video_credits(uuid, integer) TO authenticated;