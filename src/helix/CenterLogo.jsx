import React from 'react';

export default function CenterLogo({ src, mode = 'billboard' }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`center-logo no-select ${mode === 'billboard' ? 'billboard' : 'rotate'}`}
    />
  );
}