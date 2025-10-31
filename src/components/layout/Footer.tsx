import { Link } from 'react-router-dom';
import { Briefcase, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LabourHire</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting skilled contractors with customers who need their services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=user" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/user/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* For Contractors */}
          <div>
            <h3 className="font-semibold mb-4">For Contractors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=contractor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Join as Contractor
                </Link>
              </li>
              <li>
                <Link to="/contractor/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Find Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LabourHire. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
