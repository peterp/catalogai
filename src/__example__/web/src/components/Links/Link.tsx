'use client'

import React from 'react';

export function Link({ href, children }: { href: string; children: React.ReactNode }) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    history.pushState({}, 'newUrl', event.target.href);
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}