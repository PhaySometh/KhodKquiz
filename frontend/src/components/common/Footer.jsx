import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, BookOpen, Trophy, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">Khod</span>
              <span className="text-orange-400">Kquiz</span>
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Challenge your coding skills with our comprehensive quiz platform. 
              Test your knowledge, compete with others, and level up your programming expertise.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/ShurikenBy6YoungTechStudents" target="_blank" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://x.com/PhaySometh168" target='_blank' className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/phay-someth/" target='_blank' className="text-gray-400 hover:text-orange-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:phay.someth70@gmail.com" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/teacher-registration" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center">
                  <Users size={16} className="mr-2" />
                  Teacher Registration
                </Link>
              </li>
              <li>
                <a href="/leaderboard" className="text-gray-300 hover:text-orange-400 transition-colors flex items-center">
                  <Trophy size={16} className="mr-2" />
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 KhodKquiz. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Made with ❤️ for developers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;