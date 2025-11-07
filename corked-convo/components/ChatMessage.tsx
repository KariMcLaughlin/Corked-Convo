
import React from 'react';
import { Message, Role } from '../types';
import { WineGlassIcon } from './icons/WineGlassIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.Model;

  const formattedParts = message.parts.split('\n').map((line, index) => {
    // Basic markdown for bold text **text**
    const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    return <p key={index} dangerouslySetInnerHTML={{ __html: boldedLine }} />;
  });

  if (isModel) {
    return (
      <div className="flex justify-start items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-warm-taupe/20 flex items-center justify-center shrink-0 mt-1">
          <WineGlassIcon className="w-6 h-6 text-warm-taupe" />
        </div>
        <div className="bg-soft-blush/90 text-deep-burgundy px-4 py-3 rounded-2xl rounded-bl-none max-w-md md:max-w-lg lg:max-w-xl">
           <div className="prose prose-sm max-w-none text-deep-burgundy">
             {formattedParts}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-start space-x-3">
      <div className="bg-gold-accent text-deep-burgundy px-4 py-3 rounded-2xl rounded-br-none max-w-md md:max-w-lg lg:max-w-xl">
        <p>{message.parts}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-warm-taupe/20 flex items-center justify-center shrink-0 mt-1">
        <UserIcon className="w-6 h-6 text-warm-taupe" />
      </div>
    </div>
  );
};

export default ChatMessage;
