import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, url, image, keywords, children, exact = false }) => {
  const location = useLocation();
  const siteTitle = title 
    ? (exact || title.includes('Karan Singh Vaidh') ? title : `${title} | The Karan Singh Vaidh`) 
    : 'Best Ayurvedic Doctor in Solan | Natural Ayurvedic Treatment';
  const siteDesc = description || 'Looking for the best Ayurvedic Doctor in Solan? Get natural treatment for kidney stones, piles, diabetes, thyroid & more. Book your consultation today!';
  
  // Use provided url or fallback to current pathname
  const currentPath = url || location.pathname;
  const siteUrl = `https://thekaransinghvaidh.com${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;
  const siteImage = image || 'https://thekaransinghvaidh.com/logo.png';

  useEffect(() => {
    document.title = siteTitle;
    const titles = document.head.querySelectorAll('title');
    if (titles.length > 1) {
      titles.forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    }
    const descriptions = document.head.querySelectorAll('meta[name="description"]');
    if (descriptions.length > 1) {
      descriptions.forEach((el, idx) => {
        if (idx < descriptions.length - 1) el.remove();
      });
    }
  }, [siteTitle, siteDesc]);

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDesc} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDesc} />
      <meta property="twitter:image" content={siteImage} />
      {children}
    </Helmet>
  );
};

export default SEO;
