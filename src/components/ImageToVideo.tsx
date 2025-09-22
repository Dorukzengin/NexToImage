import React, { useState, useRef } from 'react';
import { Upload, Download, X, Video, Play } from 'lucide-react';
import { FalApiService } from '../services/falApi';
import { UsageGuidelines } from './UsageGuidelines';
import { LoadingSpinner } from './LoadingSpinner';
import { fileToDataUrl, sleep } from '../utils';

interface ImageToVideoProps {
  credits: number;
  onCreditsChange: (credits: number) => void;
}

export const ImageToVideo: React.FC<ImageToVideoProps> = ({ credits, onCreditsChange }) => {
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pollForVideoResult = async (requestId: string): Promise<string> => {
    const maxAttempts = 120; // 10 minutes max for video generation
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await FalApiService.checkVideoStatus(requestId);
        
        if (status.status === 'COMPLETED') {
          const result = await FalApiService.getVideoResult(requestId);
          if (result.video && result.video.url) {
            return result.video.url;
          }
          throw new Error('No video in result');
        } else if (status.status === 'FAILED') {
          throw new Error('Video generation failed');
        }
        
        await sleep(5000); // Wait 5 seconds for video generation
        attempts++;
      } catch (error) {
        console.error('Video polling error:', error);
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
        await sleep(5000);
        attempts++;
      }
    }
    
    throw new Error('Video generation timed out');
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
    setGeneratedVideo(null);

    try {
      const response = await FalApiService.generateImageToVideo({
        prompt: prompt.trim() || '',
        image_url: uploadedImage,
      });

      const videoUrl = await pollForVideoResult(response.request_id);
      
      setGeneratedVideo(videoUrl);
      onCreditsChange(credits - 2); // Video generation costs 2 credits
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = `image-to-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          <Video className="w-5 h-5 text-green-500" />
          <span>Image to Video Generation</span>
        </h2>

        <div className="space-y-6">
          <UsageGuidelines activeTab="image-to-video" />

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
              Motion prompt (optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the motion you want to see in the video (e.g., 'gentle wind blowing through hair', 'waves moving slowly')..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500">
              Leave empty for automatic motion detection
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Video generation costs 2 credits and takes 2-5 minutes to complete.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !uploadedImage || credits < 2}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            {isGenerating ? 'Generating Video...' : `Generate Video (2 credits)`}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <LoadingSpinner message="Creating your video... This may take 2-5 minutes." />
        </div>
      )}

      {generatedVideo && !isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Video</h3>
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
              <h4 className="text-sm font-medium text-gray-600 mb-2">Original Image</h4>
              <img
                src={uploadedImage}
                alt="Original"
                className="w-full rounded-lg shadow-sm"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Generated Video</h4>
              <div className="relative">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full rounded-lg shadow-sm"
                  poster={uploadedImage || undefined}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Play className="w-12 h-12 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};