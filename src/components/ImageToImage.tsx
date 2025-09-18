import React, { useState, useRef } from 'react';
import { Upload, Download, X, Image } from 'lucide-react';
import { FalApiService } from '../services/falApi';
import { ResolutionOption } from '../types';
import { ResolutionSelector } from './ResolutionSelector';
import { UsageGuidelines } from './UsageGuidelines';
import { LoadingSpinner } from './LoadingSpinner';
import { downloadImage, fileToDataUrl, sleep } from '../utils';

interface ImageToImageProps {
  credits: number;
  onCreditsChange: (credits: number) => void;
}

export const ImageToImage: React.FC<ImageToImageProps> = ({ credits, onCreditsChange }) => {
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>({
    label: '1024 × 1024',
    width: 1024,
    height: 1024,
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        await sleep(3000);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setUploadedImage(dataUrl);
      setError(null);
    } catch (err) {
      setError('Failed to process image file');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!uploadedImage) {
      setError('Please upload an image');
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
      const response = await FalApiService.generateImageToImage({
        prompt: prompt.trim(),
        image_url: uploadedImage,
        width: selectedResolution.width,
        height: selectedResolution.height,
      });

      const imageUrl = await pollForResult(response.request_id);
      
      setGeneratedImage(imageUrl);
      onCreditsChange(credits - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `image-to-image-${Date.now()}.png`);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <Image className="w-5 h-5 text-purple-500" />
          <span>Image to Image Generation</span>
        </h2>

        <div className="space-y-6">
          <UsageGuidelines activeTab="image-to-image" />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Source Image
            </label>
            
            {!uploadedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Click to upload an image</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
                <button
                  onClick={removeUploadedImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Transformation prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Transform this image into a painting, change the style, add elements..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
            disabled={isGenerating || !prompt.trim() || !uploadedImage || credits <= 0}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isGenerating ? 'Transforming...' : `Transform Image (1 credit)`}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner message="Transforming your image..." />
        </div>
      )}

      {generatedImage && !isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Transformed Image</h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Original</h4>
              <img
                src={uploadedImage}
                alt="Original"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Transformed</h4>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};