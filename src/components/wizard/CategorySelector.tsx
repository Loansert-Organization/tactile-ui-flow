
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  GraduationCap, 
  Briefcase, 
  Home, 
  Car, 
  Gamepad2, 
  ShoppingBag, 
  Users,
  Stethoscope,
  Plane
} from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  className?: string;
}

const categories = [
  { id: 'personal', name: 'Personal', icon: Heart },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'housing', name: 'Housing', icon: Home },
  { id: 'transport', name: 'Transport', icon: Car },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2 },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
  { id: 'community', name: 'Community', icon: Users },
  { id: 'health', name: 'Health', icon: Stethoscope },
  { id: 'travel', name: 'Travel', icon: Plane },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-sm text-white/70 mb-3">
        Choose a category for your basket
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => onCategorySelect(category.id)}
              className={`h-auto p-3 text-left justify-start ${
                selectedCategory === category.id
                  ? 'bg-white text-black border-white'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
