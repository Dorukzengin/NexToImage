/*
  # Create Missing Database Functions

  1. Functions
    - `update_user_credits` - Updates user image credits
    - `update_user_video_credits` - Updates user video credits
    - `update_user_plan` - Updates user plan information
    - `cancel_user_plan` - Cancels user plan

  2. Security
    - All functions check for authenticated users
    - Functions only allow users to update their own data
*/

-- Function to update user image credits
CREATE OR REPLACE FUNCTION update_user_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_credits integer;
BEGIN
  -- Check if user is authenticated and is updating their own credits
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update credits and return new value
  UPDATE user_profiles 
  SET credits = GREATEST(0, credits + credit_change),
      updated_at = now()
  WHERE id = user_id
  RETURNING credits INTO new_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_credits;
END;
$$;

-- Function to update user video credits
CREATE OR REPLACE FUNCTION update_user_video_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_video_credits integer;
BEGIN
  -- Check if user is authenticated and is updating their own credits
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update video credits and return new value
  UPDATE user_profiles 
  SET video_credits = GREATEST(0, COALESCE(video_credits, 0) + credit_change),
      updated_at = now()
  WHERE id = user_id
  RETURNING video_credits INTO new_video_credits;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_video_credits;
END;
$$;

-- Function to update user plan
CREATE OR REPLACE FUNCTION update_user_plan(user_id uuid, new_plan text, plan_type text DEFAULT 'image')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated and is updating their own plan
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update the appropriate plan column
  IF plan_type = 'image' THEN
    UPDATE user_profiles 
    SET image_plan = new_plan,
        updated_at = now()
    WHERE id = user_id;
  ELSIF plan_type = 'video' THEN
    UPDATE user_profiles 
    SET video_plan = new_plan,
        updated_at = now()
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Invalid plan type';
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Function to cancel user plan
CREATE OR REPLACE FUNCTION cancel_user_plan(user_id uuid, plan_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated and is canceling their own plan
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Cancel the appropriate plan
  IF plan_type = 'image' THEN
    UPDATE user_profiles 
    SET image_plan = 'free',
        updated_at = now()
    WHERE id = user_id;
  ELSIF plan_type = 'video' THEN
    UPDATE user_profiles 
    SET video_plan = NULL,
        updated_at = now()
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Invalid plan type';
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;