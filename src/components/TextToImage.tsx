import React, { useState } from 'react';
import { Wand2, Download } from 'lucide-react';
import { FalApiService } from '../services/falApi';
import { ResolutionOption } from '../types';
import { ResolutionSelector } from './ResolutionSelector';
import { UsageGuidelines } from './UsageGuidelines';
import { LoadingSpinner } from './LoadingSpinner';
import { downloadImage, sleep } from '../utils';

interface TextToImageProps {
  credits: number;
  onCreditsChange: (credits: number) => void;
}

export const TextToImage: React.FC<TextToImageProps> = ({ credits, onCreditsChange }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>({
    label: '1024 × 1024',
    width: 1024,
    height: 1024,
  });

  const pollForResult = async (requestId: string): Promise<string> => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await FalApiService.checkStatus(requestId);
        
        if (status.status === 'COMPLETED') {
          const result = await FalApiService.getResult(requestId);
          if (result.images && result.images.length > 0) {
            return result.images[0].url;
          }
          throw new Error('No image in result');
        } else if (status.status === 'FAILED') {
          throw new Error('Generation failed');
        }
        
        await sleep(3000); // Wait 3 seconds before checking again
        attempts++;
      } catch (error) {
        console.error('Polling error:', error);
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
        await sleep(3000);
        attempts++;
      }
    }
    
    throw new Error('Generation timed out');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (credits <= 0) {
      setError('Insufficient credits. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Submit generation request
      const response = await FalApiService.generateTextToImage({
        prompt: prompt.trim(),
        width: selectedResolution.width,
        height: selectedResolution.height,
      });

      // Poll for result
      const imageUrl = await pollForResult(response.request_id);
      
      setGeneratedImage(imageUrl);
      // Update credits in database
      const newCredits = credits - 1;
      
      // Update credits through auth hook
      try {
        const { updateCredits } = await import('../hooks/useAuth');
        // We need to access the updateCredits function from the auth context
        // For now, we'll trigger a re-fetch by calling onCreditsChange
        onCreditsChange(newCredits);
        
        // Also update in database directly
        const { supabase } = await import('../lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_profiles')
            .update({ credits: newCredits })
            .eq('id', user.id);
        }
      } catch (error) {
        console.error('Error updating credits:', error);
        // Still update local state
        onCreditsChange(newCredits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `text-to-image-${Date.now()}.png`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          <span>Text to Image Generation</span>
        </h2>

        <div className="space-y-6">
          <UsageGuidelines activeTab="text-to-image" />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful landscape with mountains and a lake at sunset..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <ResolutionSelector
            selectedResolution={selectedResolution}
            onResolutionChange={setSelectedResolution}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || credits <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isGenerating ? 'Generating...' : `Generate Image (1 credit)`}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner message="Creating your masterpiece..." />
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Image</h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};