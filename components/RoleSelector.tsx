import React from 'react';
import { Baby, Users, Briefcase } from 'lucide-react';
import { Role } from '../types';
import { ROLES } from '../constants';

interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby className="w-8 h-8 text-slate-700" />;
      case 'Users': return <Users className="w-8 h-8 text-slate-700" />;
      case 'Briefcase': return <Briefcase className="w-8 h-8 text-slate-700" />;
      default: return <Users className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full py-12 px-6">
      <div className="text-center mb-16 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3 tracking-tight">Who would you like to practice with?</h2>
        <p className="text-lg text-slate-500 font-light">选择你想要练习沟通的对象</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role)}
            className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
               {getIcon(role.iconName)}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{role.title}</h3>
            <span className="text-sm text-slate-500 mb-4 font-medium">{role.titleZh}</span>
            
            <p className="text-slate-500 text-sm leading-relaxed max-w-[200px] mb-2">
              {role.description}
            </p>
            
          </button>
        ))}
      </div>

      <div className="mt-16 text-center text-slate-400 text-sm">
        Each role offers different scenarios aligned with NEL principles
      </div>
    </div>
  );
};

export default RoleSelector;