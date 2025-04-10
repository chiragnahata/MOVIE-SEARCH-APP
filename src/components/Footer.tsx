
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-6 border-t border-border">
      <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Chirag Nahata. All rights reserved.
        </p>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Crafted with</span>
          <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" />
          <span>by Chirag Nahata</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
