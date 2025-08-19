import React from "react";
import { Link } from "react-router-dom"; // Remove if not using React Router

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 px-6 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo / Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">synctuario</h2>
          <p className="text-sm mt-2">Empowering users with technology.</p>
        </div>

        {/* Quick Links
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div> */}

        {/* Copyright */}
        <div className="md:text-right">
          <p className="text-sm">
            &copy; {currentYear} Synctuario. All rights reserved.
          </p>
          <p className="text-sm mt-1">Made with love</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
