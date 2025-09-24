export interface GenerationRequest {
  prompt: string;
  image_url?: string;
  width?: number;
  height?: number;
}

export interface GenerationResponse {
  request_id: string;
}

export interface StatusResponse {
  status: 'IN_PROGRESS' | 'IN_QUEUE' | 'COMPLETED' | 'FAILED';
  request_id: string;
}

export interface ResultResponse {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  videoCredits?: number;
  features: string[];
  planType: 'image' | 'video' | 'combo';
  level: number; // For upgrade/downgrade ordering
}

export type TabType = 'text-to-image' | 'image-to-image';
export type TabType = 'text-to-image' | 'image-to-image' | 'image-to-video';

export type ResolutionOption = {
  label: string;
  width: number;
  height: number;
};

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan: 'free' | 'starter' | 'pro';
  createdAt: Date;
}

export type AuthState = 'landing' | 'login' | 'register' | 'authenticated';

export interface UsageGuidelines {
  textToImage: string[];
  imageToImage: string[];
  general: string[];
}

export interface UserPlan {
  imagePlan: string;
  videoPlan: string;
}