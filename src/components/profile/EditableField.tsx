import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  label: string;
  value: string | null;
  onSave: (v: string) => Promise<void>;
  readOnly?: boolean;
  placeholder?: string;
}

export const EditableField: React.FC<Props> = ({ label, value, onSave, readOnly=false, placeholder='' }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    if (readOnly) return;
    setDraft(value || '');
    setEditing(true);
  };

  const cancel = () => setEditing(false);

  const save = async () => {
    setSaving(true);
    await onSave(draft.trim());
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-md bg-gray-800/50 focus:outline-none"
            value={draft}
            placeholder={placeholder}
            onChange={(e)=>setDraft(e.target.value)}
            disabled={saving}
          />
          <button onClick={save} disabled={saving} className="text-green-500"><Check size={18}/></button>
          <button onClick={cancel} disabled={saving} className="text-red-500"><X size={18}/></button>
        </div>
      ) : (
        <button onClick={startEdit} className="text-left w-full px-3 py-2 rounded-md hover:bg-white/5">
          {value || placeholder || '—'}
        </button>
      )}
    </div>
  );
}; 