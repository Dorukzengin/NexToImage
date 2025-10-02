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
  updateCredits: (newCredits: number) => Promise<number | undefined>;
  userPlan?: string;
  onBack?: () => void;
}

export const TextToImage: React.FC<TextToImageProps> = ({ credits, updateCredits, userPlan = 'free', onBack }) => {
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
      const newCredits = credits - 1;
      await updateCredits(newCredits);
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
    <div className="max-w-4xl mx-auto p-3 xs:p-4 sm:p-6 space-y-6 xs:space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xs:p-5 sm:p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Models</span>
          </button>
        )}
        
        <h2 className="text-lg xs:text-xl font-semibold text-gray-800 mb-4 xs:mb-5 sm:mb-6 flex items-center space-x-2">
          <Wand2 className="w-4 xs:w-5 h-4 xs:h-5 text-blue-500" />
          <span>Text to Image Generation</span>
        </h2>

        <div className="space-y-4 xs:space-y-5 sm:space-y-6">
          <UsageGuidelines activeTab="text-to-image" />

          <div className="space-y-2">
            <label className="block text-sm xs:text-base font-medium text-gray-700">
              Describe your image
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful landscape with mountains and a lake at sunset..."
              className="w-full px-3 xs:px-4 py-2.5 xs:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm xs:text-base"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <ResolutionSelector
            selectedResolution={selectedResolution}
            onResolutionChange={setSelectedResolution}
            userPlan={userPlan}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 xs:p-4">
              <p className="text-red-600 text-sm xs:text-base">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || credits <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 xs:py-3 px-4 xs:px-6 rounded-lg text-sm xs:text-base font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 xs:p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3 xs:mb-4">
            <h3 className="text-base xs:text-lg font-semibold text-gray-800">Generated Image</h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 xs:space-x-2 bg-emerald-500 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg text-sm xs:text-base hover:bg-emerald-600 transition-colors duration-200"
            >
              <Download className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full max-w-xl xs:max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};