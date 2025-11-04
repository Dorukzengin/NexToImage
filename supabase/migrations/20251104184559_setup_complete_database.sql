/*
  # Complete Database Setup for NexToImage

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text)
      - `avatar_url` (text)
      - `credits` (integer, default 2) - Image generation credits
      - `video_credits` (integer, default 0) - Video generation credits
      - `image_plan` (text, default 'free') - User's image plan
      - `video_plan` (text, default 'free') - User's video plan
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to view their own profile
    - Add policy for users to update their own profile
    - Add policy for users to insert their own profile

  3. Functions
    - `handle_new_user()` - Automatically create user profile on signup
    - `update_user_credits(user_id, credit_change)` - Update image credits
    - `update_user_video_credits(user_id, credit_change)` - Update video credits
    - `update_user_plan(user_id, plan_type, plan_name)` - Update user plan

  4. Triggers
    - Auto-create profile when new user signs up
*/

-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  credits integer DEFAULT 2 NOT NULL,
  video_credits integer DEFAULT 0 NOT NULL,
  image_plan text DEFAULT 'free' NOT NULL CHECK (image_plan IN ('free', 'starter', 'pro', 'premium')),
  video_plan text DEFAULT 'free' NOT NULL CHECK (video_plan IN ('free', 'video-starter')),
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to update user credits
CREATE OR REPLACE FUNCTION public.update_user_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_credits integer;
BEGIN
  -- Check if user is authenticated and can only update their own credits
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update credits and return new value
  UPDATE public.user_profiles 
  SET credits = GREATEST(0, credits + credit_change)
  WHERE id = user_id
  RETURNING credits INTO new_credits;

  -- If no user found, raise exception
  IF new_credits IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_credits;
END;
$$;

-- Create function to update user video credits
CREATE OR REPLACE FUNCTION public.update_user_video_credits(user_id uuid, credit_change integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_video_credits integer;
BEGIN
  -- Check if user is authenticated and can only update their own credits
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update video credits and return new value
  UPDATE public.user_profiles 
  SET video_credits = GREATEST(0, video_credits + credit_change)
  WHERE id = user_id
  RETURNING video_credits INTO new_video_credits;

  -- If no user found, raise exception
  IF new_video_credits IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN new_video_credits;
END;
$$;

-- Create function to update user plan
CREATE OR REPLACE FUNCTION public.update_user_plan(user_id uuid, plan_type text, plan_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated and can only update their own plan
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Update the appropriate plan column
  IF plan_type = 'image' THEN
    UPDATE public.user_profiles 
    SET image_plan = plan_name
    WHERE id = user_id;
  ELSIF plan_type = 'video' THEN
    UPDATE public.user_profiles 
    SET video_plan = plan_name
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Invalid plan type';
  END IF;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.update_user_credits(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_video_credits(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_plan(uuid, text, text) TO authenticated;

-- Create trigger function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();