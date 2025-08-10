"use client";

import { useState } from "react";
import { CategoryFilter, CATEGORIES } from "~/components/ui/CategoryFilter";
import { Button } from "~/components/ui/Button";

interface CreateTipJarFormData {
  title: string;
  description: string;
  targetAmount: string;
  category: string;
  coverImage?: File;
}

interface CreateTipJarScreenProps {
  onBack?: () => void;
  onSave?: (formData: CreateTipJarFormData) => void;
  onCancel?: () => void;
}

export default function CreateTipJarScreen({ 
  onBack, 
  onSave, 
  onCancel 
}: CreateTipJarScreenProps) {
  const [formData, setFormData] = useState<CreateTipJarFormData>({
    title: "",
    description: "",
    targetAmount: "",
    category: "tech"
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateTipJarFormData>>({});

  const handleInputChange = (field: keyof CreateTipJarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, coverImage: "Image must be less than 5MB" }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverImage: "Please select a valid image file" }));
        return;
      }

      setFormData(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      setErrors(prev => ({ ...prev, coverImage: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateTipJarFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 60) {
      newErrors.title = "Title must be less than 60 characters";
    }

    if (!formData.targetAmount.trim()) {
      newErrors.targetAmount = "Target amount is required";
    } else {
      const amount = parseFloat(formData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = "Please enter a valid amount";
      } else if (amount > 100000) {
        newErrors.targetAmount = "Target amount cannot exceed $100,000";
      } else if (amount < 1) {
        newErrors.targetAmount = "Minimum target amount is $1";
      }
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.(formData);
    } catch (error) {
      console.error("Error creating tip jar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-blue-500 hover:text-blue-600">
            ←
          </button>
          <span className="font-semibold text-gray-900">Create Tip Jar</span>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-6">
        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📷 Add Cover Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            {coverImagePreview ? (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setCoverImagePreview(null);
                    setFormData(prev => ({ ...prev, coverImage: undefined }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="text-gray-400 mb-2">📁</div>
                <div className="text-sm text-gray-600 mb-2">Upload Image</div>
                <div className="text-xs text-gray-400">Recommended: 400x300px</div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {errors.coverImage && (
            <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 What's your goal?
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Coffee for my startup..."
            maxLength={60}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {formData.title.length}/60
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✍️ Tell your story (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="I'm building an app that helps people track their daily habits..."
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {formData.description.length}/500
            </span>
          </div>
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💰 Funding Goal
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => handleInputChange("targetAmount", e.target.value)}
              placeholder="200"
              min="1"
              max="100000"
              step="1"
              className={`w-full pl-8 pr-16 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.targetAmount ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              USDC
            </span>
          </div>
          {errors.targetAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.targetAmount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            📂 Category
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <span className="text-lg">{selectedCategory?.emoji}</span>
              <span className="font-medium text-gray-900">{selectedCategory?.name}</span>
            </div>
            <CategoryFilter
              selectedCategory={formData.category}
              onCategoryChange={(category) => handleInputChange("category", category)}
              variant="chips"
              showEmojis={true}
            />
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.title.trim() || !formData.targetAmount.trim()}
          isLoading={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          {isSubmitting ? "Creating..." : "Create Tip Jar"}
        </Button>
      </div>
    </div>
  );
}