
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
      case 'Baby': return <Baby className="w-10 h-10 text-slate-700" />;
      case 'Users': return <Users className="w-10 h-10 text-slate-700" />;
      case 'Briefcase': return <Briefcase className="w-10 h-10 text-slate-700" />;
      default: return <Users className="w-10 h-10" />;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full py-12 px-6">
      <div className="text-center mb-16 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Who would you like to practice with?</h2>
        <p className="text-xl text-slate-500 font-normal">选择你想要练习沟通的对象</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl px-4">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role)}
            className="flex flex-col items-center text-center p-8 md:p-10 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group h-full"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300 shadow-inner">
               {getIcon(role.iconName)}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors">{role.title}</h3>
            <span className="text-lg text-slate-500 mb-6 font-medium block">{role.titleZh}</span>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-[240px] mb-4">
              {role.description}
            </p>
            
          </button>
        ))}
      </div>

      <div className="mt-20 text-center text-slate-400 text-sm md:text-base font-medium bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
        Each role offers different scenarios aligned with NEL principles
      </div>
    </div>
  );
};

export default RoleSelector;
