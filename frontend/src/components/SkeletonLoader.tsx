import React from 'react';

export const SkeletonText = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-bg rounded-md ${className}`} />
);

export const SkeletonAvatar = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-bg rounded-full ${className}`} />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-bg rounded-2xl ${className}`} />
);

export const SkeletonTable = () => (
  <div className="w-full space-y-4">
    <div className="h-10 skeleton-bg rounded-md w-full" />
    <div className="h-8 skeleton-bg rounded-md w-full opacity-80" />
    <div className="h-8 skeleton-bg rounded-md w-full opacity-60" />
    <div className="h-8 skeleton-bg rounded-md w-full opacity-40" />
  </div>
);
