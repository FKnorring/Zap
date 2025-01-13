import { Link } from 'react-router-dom';
import { Github, Info, Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: 'Lisa Hansson',
    linkedin: 'https://www.linkedin.com/in/lisa-hansson/',
    email: 'lisa.hansson@zap.com',
    github: 'https://github.com/eliha458',
  },
  {
    name: 'Nils Persson',
    linkedin: 'https://www.linkedin.com/in/nils-albin-persson/',
    email: 'nils.persson@zap.com',
    github: 'https://github.com/NilssPersson',
  },
  {
    name: 'Ramez Shakarna',
    linkedin: 'https://www.linkedin.com/in/ramezshakarna/',
    email: 'ramez.shakarna@zap.com',
    github: 'https://github.com/ramezio',
  },
  {
    name: 'Filip von Knorring',
    linkedin: 'https://www.linkedin.com/in/filip-v-4b9976139/',
    email: 'filip.von.knorring@zap.com',
    github: 'https://github.com/FKnorring',
  },
  {
    name: 'Jacob Dillström',
    linkedin: 'https://www.linkedin.com/in/jacob-dillstrom/',
    email: 'jacob.dillstrom@zap.com',
    github: 'https://github.com/Dillenzz',
  },
]

export function Footer() {
  return (
    <footer className="w-full bg-gray-200 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="font-display text-xl text-gray-800">Zap</h3>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Zap. All rights reserved.
          </p>
          <div className="flex flex-col gap-2">
            <Link 
              to="/about" 
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>About Us</span>
              <Info size={20} />
            </Link>
            <a
              href="https://github.com/FKnorring/Zap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span>Visit our GitHub</span>
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="font-display text-xl text-gray-800 mb-6 text-center md:text-left">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-16 md:px-0">
            {/* Team Members - Column 1 */}
            <div className="flex flex-col gap-6">
              {teamMembers.slice(0, 3).map((member, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Linkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Github size={18} />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Members - Column 2 */}
            <div className="flex flex-col gap-6">
              {teamMembers.slice(3).map((member, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Linkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Github size={18} />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                    >
                      <Mail size={18} />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 