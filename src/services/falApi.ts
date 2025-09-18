import { GenerationRequest, GenerationResponse, StatusResponse, ResultResponse } from '../types';

const FAL_KEY = '00bdb59e-2b83-4a4e-bc56-75de8c2d16c0:95c17d1893b2ce5c5a20598168d0438e';

export class FalApiService {
  private static readonly TEXT_TO_IMAGE_URL = 'https://queue.fal.run/fal-ai/flux-pro/kontext/max/text-to-image';
  private static readonly IMAGE_TO_IMAGE_URL = 'https://queue.fal.run/fal-ai/flux-pro/kontext/max';
  private static readonly BASE_REQUEST_URL = 'https://queue.fal.run/fal-ai/flux-pro/requests';

  private static getHeaders(): Record<string, string> {
    return {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  static async generateTextToImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response = await fetch(this.TEXT_TO_IMAGE_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          width: request.width || 1024,
          height: request.height || 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Text-to-image generation failed:', error);
      throw new Error('Failed to generate image. Please try again.');
    }
  }

  static async generateImageToImage(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      const response = await fetch(this.IMAGE_TO_IMAGE_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: request.prompt,
          image_url: request.image_url,
          width: request.width || 1024,
          height: request.height || 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Image-to-image generation failed:', error);
      throw new Error('Failed to generate image. Please try again.');
    }
  }

  static async checkStatus(requestId: string): Promise<StatusResponse> {
    try {
      const response = await fetch(`${this.BASE_REQUEST_URL}/${requestId}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status check failed:', error);
      throw new Error('Failed to check generation status.');
    }
  }

  static async getResult(requestId: string): Promise<ResultResponse> {
    try {
      const response = await fetch(`${this.BASE_REQUEST_URL}/${requestId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Result fetch failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Result fetch failed:', error);
      throw new Error('Failed to get generation result.');
    }
  }
}