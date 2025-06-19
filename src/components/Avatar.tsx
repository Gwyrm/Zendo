import React from 'react';
import { Member } from '../types';

interface AvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ member, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br from-blue-400 to-purple-500
        flex items-center justify-center
        text-white font-semibold
        border-2 border-white
        shadow-md
        ${className}
      `}
      title={member.name}
    >
      {member.avatar ? (
        <img
          src={member.avatar}
          alt={member.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        member.initials
      )}
    </div>
  );
};