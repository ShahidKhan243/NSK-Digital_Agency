import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project.";

  return (
    <aside aria-label="WhatsApp Quick Contact">
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp at 8807855118"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white pl-3.5 pr-4 py-3 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95"
      >
      {/* WhatsApp SVG Icon */}
      <svg 
        className="w-6 h-6 fill-current shrink-0 animate-pulse" 
        viewBox="0 0 24 24"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.127-.532-1.706-.708-2.806-2.457-2.89-2.57-.084-.112-.693-.923-.693-1.761 0-.839.44-1.252.597-1.424.156-.172.342-.215.456-.215.114 0 .228.002.327.008.106.006.248-.04.388.297.144.348.491 1.2.534 1.287.043.087.072.189.014.303-.058.115-.087.187-.174.288-.087.102-.183.228-.261.306-.088.087-.18.181-.077.357.102.176.456.753.978 1.218.672.597 1.238.782 1.414.869.176.087.279.073.383-.044.103-.117.44-.514.557-.69.117-.176.234-.146.393-.087.159.058 1.009.476 1.182.563.173.087.289.131.332.203.043.072.043.418-.101.823zM12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.39A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.637 0-3.15-.494-4.417-1.341l-.316-.213-2.955.823.82-2.884-.233-.332A8.136 8.136 0 0 1 3.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
      </svg>
      <span className="text-xs font-bold whitespace-nowrap hidden sm:inline-block">
        Contact us on WhatsApp
      </span>
      <span className="text-xs font-bold whitespace-nowrap sm:hidden">
        WhatsApp
      </span>
    </a>
    </aside>
  );
};
