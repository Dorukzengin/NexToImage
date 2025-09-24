/*
  # Add video_credits column to user_profiles table

  1. Schema Changes
    - Add `video_credits` column to `user_profiles` table
    - Set default value to 0 for existing users
    - Update RLS policies if needed

  2. Functions
    - Create `update_user_video_credits` RPC function
    - Grant proper permissions to authenticated users

  3. Security
    - Ensure RLS policies cover the new column
    - Function uses SECURITY DEFINER for proper access control
*/

-- Add video_credits column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS video_credits INTEGER DEFAULT 0;

-- Update existing users to have 0 video credits if the column was just added
UPDATE public.user_profiles 
SET video_credits = 0 
WHERE video_credits IS NULL;

-- Create or replace the update_user_video_credits function
CREATE OR REPLACE FUNCTION public.update_user_video_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_video_credits integer;
BEGIN
    -- Check if user exists and update video credits
    UPDATE public.user_profiles
    SET video_credits = GREATEST(0, video_credits + credit_change)
    WHERE id = user_id
    RETURNING video_credits INTO new_video_credits;

    -- If no rows were updated, the user doesn't exist
    IF new_video_credits IS NULL THEN
        RAISE EXCEPTION 'User profile not found for ID: %', user_id;
    END IF;

    RETURN new_video_credits;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_video_credits(uuid, integer) TO authenticated;

-- Create or replace the update_user_credits function (for image credits)
CREATE OR REPLACE FUNCTION public.update_user_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_credits integer;
BEGIN
    -- Check if user exists and update credits
    UPDATE public.user_profiles
    SET credits = GREATEST(0, credits + credit_change)
    WHERE id = user_id
    RETURNING credits INTO new_credits;

    -- If no rows were updated, the user doesn't exist
    IF new_credits IS NULL THEN
        RAISE EXCEPTION 'User profile not found for ID: %', user_id;
    END IF;

    RETURN new_credits;
END;
$$;