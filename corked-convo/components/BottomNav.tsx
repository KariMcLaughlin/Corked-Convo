
import React from 'react';
import { Page } from '../types';
import { ChatIcon } from './icons/ChatIcon';
import { WineGlassIcon } from './icons/WineGlassIcon';
import { BlogIcon } from './icons/BlogIcon';
import { TravelIcon } from './icons/TravelIcon';
import { RecipeIcon } from './icons/RecipeIcon';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems = [
  { page: Page.Chat, label: 'Chat', icon: ChatIcon },
  { page: Page.Recommendations, label: 'Wines', icon: WineGlassIcon },
  { page: Page.Blog, label: 'Blog', icon: BlogIcon },
  { page: Page.Travel, label: 'Travel', icon: TravelIcon },
  { page: Page.Recipes, label: 'Recipes', icon: RecipeIcon },
];

const NavItem: React.FC<{
  item: typeof navItems[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-gold-accent' : 'text-warm-taupe hover:text-soft-blush'
    }`}
  >
    <item.icon className="w-6 h-6 mb-1" />
    <span className="text-xs tracking-tight">{item.label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="h-16 bg-black/30 backdrop-blur-sm border-t border-warm-taupe/20 flex justify-around items-center shrink-0">
      {navItems.map((item) => (
        <NavItem
          key={item.page}
          item={item}
          isActive={currentPage === item.page}
          onClick={() => onPageChange(item.page)}
        />
      ))}
    </nav>
  );
};

export default BottomNav;
