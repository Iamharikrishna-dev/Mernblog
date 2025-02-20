import React, { useEffect, useRef } from "react";
import "./ShareOptions.css";

// Import Icons
import copyIcon from "../icons/copy.png";
import fbIcon from "../icons/facebook.png";
import xIcon from "../icons/x.png";
import telegramIcon from "../icons/telegram.png";
import whatsappIcon from "../icons/whatsapp.png";
import instagramIcon from "../icons/instagram.png";

const ShareOptions = ({ blogId, closeDropdown }) => {
  const shareRef = useRef();

  // ✅ Ensure `shareUrl` is valid
  const shareUrl = blogId ? `${window.location.origin}/blog/${blogId}` : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDropdown]);

  const handleCopyLink = () => {
    if (!shareUrl) {
      alert("Error: Blog URL is missing.");
      return;
    }

    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Blog URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL. Please try again."));
    
    closeDropdown();
  };

  const handleShare = (url) => {
    if (!shareUrl) {
      alert("Error: Invalid share URL.");
      return;
    }

    window.open(url, "_blank");
    closeDropdown();
  };

  return (
    <div className="share-options" ref={shareRef}>
      <button onClick={handleCopyLink}>
        <img src={copyIcon} alt="Copy" width="20" height="20" /> Copy Link
      </button>

      <button onClick={() => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}>
        <img src={fbIcon} alt="Facebook" width="20" height="20" /> Share on Facebook
      </button>

      <button onClick={() => handleShare(`https://twitter.com/intent/tweet?url=${shareUrl}`)}>
        <img src={xIcon} alt="X" width="20" height="20" /> Share on X
      </button>

      <button onClick={() => handleShare(`https://t.me/share/url?url=${shareUrl}`)}>
        <img src={telegramIcon} alt="Telegram" width="20" height="20" /> Share on Telegram
      </button>

      <button onClick={() => handleShare(`https://api.whatsapp.com/send?text=${shareUrl}`)}>
        <img src={whatsappIcon} alt="WhatsApp" width="20" height="20" /> Share on WhatsApp
      </button>

      <button onClick={() => handleShare(`https://www.instagram.com/`)}>
        <img src={instagramIcon} alt="Instagram" width="20" height="20" /> Share on Instagram
      </button>
    </div>
  );
};

export default ShareOptions;
