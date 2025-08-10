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
    <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center border border-border hover:bg-accent/80 transition-all duration-200"
          >
            <span className="text-lg">←</span>
          </button>
          <div>
            <h1 className="font-bold text-foreground text-lg">Create Tip Jar</h1>
            <p className="text-xs text-muted-foreground">Setup your funding goal</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground bg-accent hover:bg-accent/80 rounded-lg transition-all duration-200"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-8">
        {/* Enhanced Cover Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            📷 Add Cover Image
          </label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-200 bg-gradient-to-br from-accent/30 to-accent/10 relative overflow-hidden">
            {coverImagePreview ? (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  onClick={() => {
                    setCoverImagePreview(null);
                    setFormData(prev => ({ ...prev, coverImage: undefined }));
                  }}
                  className="absolute top-3 right-3 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-destructive/80 transition-all duration-200 shadow-lg"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="text-sm font-medium text-foreground mb-2">Upload Image</div>
                <div className="text-xs text-muted-foreground">Recommended: 400x300px • Max 5MB</div>
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
            <p className="text-destructive text-xs mt-2 flex items-center gap-1">
              <span>⚠️</span> {errors.coverImage}
            </p>
          )}
        </div>

        {/* Enhanced Title Input */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            🎯 What's your goal?
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Coffee for my startup..."
            maxLength={60}
            className={`w-full px-4 py-4 border rounded-xl bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
              errors.title ? "border-destructive" : "border-border"
            }`}
          />
          <div className="flex justify-between mt-2">
            {errors.title && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {formData.title.length}/60
            </span>
          </div>
        </div>

        {/* Enhanced Description */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            ✍️ Tell your story (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="I'm building an app that helps people track their daily habits..."
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-4 border rounded-xl bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all duration-200 ${
              errors.description ? "border-destructive" : "border-border"
            }`}
          />
          <div className="flex justify-between mt-2">
            {errors.description && (
              <p className="text-destructive text-xs flex items-center gap-1">
                <span>⚠️</span> {errors.description}
              </p>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {formData.description.length}/500
            </span>
          </div>
        </div>

        {/* Enhanced Target Amount */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            💰 Funding Goal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
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
              className={`w-full pl-10 pr-20 py-4 border rounded-xl bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${
                errors.targetAmount ? "border-destructive" : "border-border"
              }`}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
              USDC
            </span>
          </div>
          {errors.targetAmount && (
            <p className="text-destructive text-xs mt-2 flex items-center gap-1">
              <span>⚠️</span> {errors.targetAmount}
            </p>
          )}
        </div>

        {/* Enhanced Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-4">
            📂 Category
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-lg">{selectedCategory?.emoji}</span>
              </div>
              <div>
                <div className="font-semibold text-foreground">{selectedCategory?.name}</div>
                <div className="text-xs text-muted-foreground">Selected category</div>
              </div>
            </div>
            <CategoryFilter
              selectedCategory={formData.category}
              onCategoryChange={(category) => handleInputChange("category", category)}
              variant="chips"
              showEmojis={true}
            />
          </div>
        </div>

        {/* Enhanced Create Button */}
        <div className="space-y-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title.trim() || !formData.targetAmount.trim()}
            isLoading={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:from-muted disabled:to-muted disabled:text-muted-foreground"
          >
            {isSubmitting ? "Creating..." : "🚀 Create Tip Jar"}
          </Button>
          
          {/* Progress indicator */}
          <div className="text-center text-xs text-muted-foreground">
            Step 1 of 1 • Almost there!
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}