export default function Footer() {
  return (
    <footer className="w-full bg-[#181818] text-white pt-[clamp(2rem,5vw,3rem)] pb-[clamp(1.5rem,4vw,2.5rem)] px-4 md:px-[clamp(1rem,8vw,120px)] mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-y-[clamp(2rem,5vw,3rem)] gap-x-[clamp(2rem,12vw,210px)]">
        {/* Left: Logo & Description */}
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logos/foody_logo_r.svg" alt="Foody Logo" className="h-7 w-7" />
            <span className="font-bold text-[clamp(1.1rem,2vw,1.3rem)]">Foody</span>
          </div>
          <p className="text-[clamp(0.9rem,1.2vw,1rem)] text-gray-300 mb-4 max-w-[380px]">
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared every day. Order
            online or visit our nearest branch.
          </p>
          <div className="font-semibold mb-2 text-[clamp(0.95rem,1vw,1.05rem)]">
            Follow on Social Media
          </div>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-white hover:text-white hover:bg-primary hover:border-primary transition-colors duration-300"
            >
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-white hover:text-white hover:bg-primary hover:border-primary transition-colors duration-300"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-white hover:text-white hover:bg-primary hover:border-primary transition-colors duration-300"
            >
              <i className="fab fa-linkedin-in text-lg"></i>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-800 text-white hover:text-white hover:bg-primary hover:border-primary transition-colors duration-300"
            >
              <i className="fab fa-tiktok text-lg"></i>
            </a>
          </div>
        </div>
        {/* Explore & Help: Responsive row on mobile, column on desktop */}
        <div className="w-full flex flex-row gap-4 md:gap-0 md:flex-1 md:min-w-[120px] mb-8 md:mb-0">
          <div className="w-1/2 md:w-auto pl-0">
            <h4 className="font-semibold mb-2 text-[clamp(1rem,1.5vw,1.1rem)]">Explore</h4>
            <ul className="space-y-1 text-gray-300 text-[clamp(0.9rem,1vw,1rem)]">
              <li>All Food</li>
              <li>Nearby</li>
              <li>Discount</li>
              <li>Best Seller</li>
              <li>Delivery</li>
              <li>Lunch</li>
            </ul>
          </div>
          <div className="w-1/2 md:w-auto pr-0">
            <h4 className="font-semibold mb-2 text-[clamp(1rem,1.5vw,1.1rem)]">Help</h4>
            <ul className="space-y-1 text-gray-300 text-[clamp(0.9rem,1vw,1rem)]">
              <li>How to Order</li>
              <li>Payment Methods</li>
              <li>Track My Order</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-9">
        &copy; {new Date().getFullYear()} Foody. All rights reserved.
      </div>
    </footer>
  );
}