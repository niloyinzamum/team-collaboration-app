import Image from 'next/image';

interface UserSelectProps {
  members: Array<{
    id: string;
    name: string;
    email: string;
    image: string;
  }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
  singleSelect?: boolean;
}

export function UserSelect({ 
  members, 
  selectedIds, 
  onChange, 
  className = '',
  singleSelect = false 
}: UserSelectProps) {
  return (
    <div className={`flex flex-wrap gap-2 p-2 ${className}`}>
      {members.map(member => (
        <div
          key={member.id}
          onClick={() => {
            if (singleSelect) {
              onChange([member.id]);
            } else {
              const newIds = selectedIds.includes(member.id)
                ? selectedIds.filter(id => id !== member.id)
                : [...selectedIds, member.id];
              onChange(newIds);
            }
          }}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
            ${selectedIds.includes(member.id) 
              ? 'bg-purple-500/20 border-purple-500' 
              : 'bg-white/5 hover:bg-white/10 border-transparent'
            } border`}
        >
          <Image
            src={member.image || '/default-avatar.png'}
            alt={member.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-white">{member.name}</span>
        </div>
      ))}
    </div>
  );
}