import React from 'react';

interface RoleToggleProps {
  value: string;
  onChange: (v: string) => void;
  roles: string[];
}

const RoleToggle: React.FC<RoleToggleProps> = ({ value, onChange, roles }) => {
  const getRoleLabel = (role: string): string => {
    const roleLabels: Record<string, string> = {
      'BussinessOwner': 'Руководитель',
      'BranchManager': 'Руководитель',
      'Employee': 'Сотрудник',
    };
    return roleLabels[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleGroup = (role: string): string => {
    const roleGroups: Record<string, string> = {
      'BussinessOwner': 'manager',
      'BranchManager': 'manager',
      'Employee': 'employee',
    };
    return roleGroups[role] || role;
  };

  // Group roles by their display labels
  const groupedRoles = roles.reduce((acc, role) => {
    const group = getRoleGroup(role);
    if (!acc[group]) {
      acc[group] = {
        label: getRoleLabel(role),
        roles: [role],
        displayRole: role
      };
    } else {
      acc[group].roles.push(role);
    }
    return acc;
  }, {} as Record<string, { label: string; roles: string[]; displayRole: string }>);

  const displayGroups = Object.values(groupedRoles);

  if (!roles || roles.length === 0) {
    return null;
  }

  if (displayGroups.length === 1) {
    return null;
  }

  const handleGroupChange = (groupRole: string) => {
    const group = Object.values(groupedRoles).find(g => g.displayRole === groupRole);
    if (group) {
      // If current role is in this group, keep it; otherwise use the first role in the group
      const targetRole = group.roles.includes(value) ? value : group.roles[0];
      onChange(targetRole);
    }
  };

  return (
    <div className="w-full mt-3">
      <div className="w-full flex bg-[#f3f4f6] rounded-full p-1">
        {displayGroups.map((group) => {
          const isActive = group.roles.includes(value);
          return (
            <button
              key={group.displayRole}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleGroupChange(group.displayRole)}
              className={`flex-1 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'bg-transparent text-gray-400'
              }`}
            >
              <span className="leading-none">{group.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleToggle;
