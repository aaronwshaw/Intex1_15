import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] text-gray-300 py-6 px-8 mt-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-sm gap-x-8">
        <Link
          to="/privacy"
          className="hover:text-white underline transition duration-200 whitespace-nowrap"
        >
          Privacy Policy
        </Link>
        &emsp;
        <span className="whitespace-nowrap">
          &copy; {new Date().getFullYear()} CineNiche. All rights
          reserved.&emsp;
        </span>
        <a
          href="#"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaFacebookF color="#1877F2" size={20} />
        </a>
        &emsp;
        <a
          href="#"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaInstagram color="#C13584" size={20} />
        </a>
        &emsp;
        <a
          href="#"
          className="hover:scale-110 transition-transform duration-200"
        >
          <FaTwitter color="#1DA1F2" size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
