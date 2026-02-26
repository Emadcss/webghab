
import React from 'react';

const shortcuts = [
  { icon: '📱', label: 'موبایل' },
  { icon: '⌚', label: 'ساعت هوشمند' },
  { icon: '🛡️', label: 'قاب موبایل' },
  { icon: '🎧', label: 'هدفون' },
];

const ShortcutSections: React.FC = () => {
  return (
    <section className="flex flex-wrap justify-center gap-8 md:gap-20">
      {shortcuts.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-4 group cursor-pointer">
          <div className="w-20 h-20 md:w-24 md:h-24 glass-island rounded-full flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110">
            {item.icon}
          </div>
          <span className="font-black text-gray-800 dark:text-gray-200 text-xs md:text-sm">
            {item.label}
          </span>
        </div>
      ))}
    </section>
  );
};

export default ShortcutSections;
