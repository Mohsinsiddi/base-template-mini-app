export const CATEGORIES = [
  { id: "all", name: "All", emoji: "🌟" },
  { id: "art", name: "Art", emoji: "🎨" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "tech", name: "Tech", emoji: "💻" },
  { id: "food", name: "Food", emoji: "🍕" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "other", name: "Other", emoji: "📦" }
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  variant?: "pills" | "chips";
  showEmojis?: boolean;
  className?: string;
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange,
  variant = "pills",
  showEmojis = false,
  className = ""
}: CategoryFilterProps) {
  const baseButtonClass = "whitespace-nowrap transition-colors font-medium";
  
  const pillClass = `${baseButtonClass} px-4 py-2 rounded-full text-sm`;
  const chipClass = `${baseButtonClass} px-3 py-1 rounded-lg text-xs`;
  
  const buttonClass = variant === "pills" ? pillClass : chipClass;
  
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`${buttonClass} ${
              isSelected
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            {showEmojis && (
              <span className="mr-1">{category.emoji}</span>
            )}
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

// Helper function to get category by ID
export function getCategoryById(id: string) {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
}

// Helper function to get category display name
export function getCategoryName(id: string) {
  return getCategoryById(id).name;
}