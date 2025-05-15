import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '' 
}: AdSenseProps) {
  useEffect(() => {
    // Check if AdSense is loaded
    if (window.adsbygoogle) {
      try {
        // Push the ad to the queue for display
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client="ca-pub-8786267623751774"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// For TypeScript global declaration
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}