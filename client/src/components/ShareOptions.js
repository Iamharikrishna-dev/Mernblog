import React, { useEffect, useRef } from 'react';
import './ShareOptions.css';

const ShareOptions = ({ shareUrl, closeDropdown }) => {
  const shareRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Blog URL copied to clipboard!');
    closeDropdown();
  };

  const handleShareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
    closeDropdown();
  };

  const handleShareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, '_blank');
    closeDropdown();
  };

  return (
    <div className="share-options" ref={shareRef}>
      <button onClick={handleCopyLink}>Copy Link</button>
      <button onClick={handleShareOnFacebook}>Share on Facebook</button>
      <button onClick={handleShareOnTwitter}>Share on Twitter</button>
    </div>
  );
};

export default ShareOptions;