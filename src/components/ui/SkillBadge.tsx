import React from 'react';

interface SkillBadgeProps {
  skill: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

const skillColors: Record<string, string> = {
  'React': 'blue',
  'Node.js': 'green',
  'Python': 'blue',
  'Java': 'yellow',
  'TypeScript': 'blue',
  'JavaScript': 'yellow',
  'Machine Learning': 'purple',
  'AI': 'purple',
  'Flutter': 'blue',
  'Android': 'green',
  'iOS': 'gray',
  'Docker': 'blue',
  'Kubernetes': 'blue',
  'AWS': 'yellow',
  'DevOps': 'gray',
  'SQL': 'green',
  'MongoDB': 'green',
  'Redis': 'red',
  'Go': 'blue',
  'Rust': 'yellow',
  'C++': 'blue',
  'Blockchain': 'purple',
  'UI/UX': 'purple',
  'Figma': 'purple',
};

function getColorClass(skill: string): string {
  return skillColors[skill] || 'gray';
}

export function SkillBadge({ skill, onRemove, size = 'md' }: SkillBadgeProps) {
  const color = getColorClass(skill);
  const classMap: Record<string, string> = {
    blue: 'gh-badge-blue',
    green: 'gh-badge-green',
    red: 'gh-badge-red',
    yellow: 'gh-badge-yellow',
    purple: 'gh-badge-purple',
    gray: 'gh-badge-gray',
  };

  return (
    <span
      className={`gh-badge ${classMap[color]}`}
      style={{ fontSize: size === 'sm' ? '11px' : '12px', gap: onRemove ? '4px' : undefined }}
    >
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'inline-flex', opacity: 0.7 }}
        >
          ×
        </button>
      )}
    </span>
  );
}

// Skill selector component
interface SkillSelectorProps {
  selected: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

const ALL_SKILLS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'TypeScript',
  'JavaScript', 'Machine Learning', 'AI', 'Flutter', 'Android', 'iOS',
  'Docker', 'Kubernetes', 'AWS', 'DevOps', 'SQL', 'MongoDB', 'Redis',
  'Go', 'Rust', 'C++', 'Blockchain', 'UI/UX', 'Figma', 'Spring Boot',
  'FastAPI', 'GraphQL', 'WebRTC', 'NLP', 'Computer Vision',
];

export function SkillSelector({ selected, onChange, placeholder = 'Search skills...' }: SkillSelectorProps) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const filtered = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(query.toLowerCase()) && !selected.includes(s)
  );

  const add = (skill: string) => {
    onChange([...selected, skill]);
    setQuery('');
  };

  const remove = (skill: string) => {
    onChange(selected.filter(s => s !== skill));
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px',
        border: '1px solid var(--color-border)', borderRadius: '6px',
        padding: '6px 8px', minHeight: '36px',
        backgroundColor: 'var(--color-bg-primary)',
        cursor: 'text',
      }} onClick={() => setOpen(true)}>
        {selected.map(s => (
          <SkillBadge key={s} skill={s} onRemove={() => remove(s)} size="sm" />
        ))}
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ''}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            color: 'var(--color-text-primary)', fontSize: '13px',
            minWidth: '120px', flex: 1,
          }}
        />
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)', borderRadius: '6px',
          zIndex: 50, maxHeight: '200px', overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginTop: '4px',
        }}>
          {filtered.map(s => (
            <div
              key={s}
              onClick={() => { add(s); setOpen(false); }}
              style={{
                padding: '6px 12px', cursor: 'pointer', fontSize: '13px',
                color: 'var(--color-text-primary)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
