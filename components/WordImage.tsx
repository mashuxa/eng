'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/progress-context';

export default function WordImage({ imgKey, size = 'sm' }: { imgKey: string; size?: 'sm' | 'lg' }) {
  const { progress, setImage, clearImage } = useProgress();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const url = progress.images[imgKey];

  function save() {
    const trimmed = draft.trim();
    if (trimmed) setImage(imgKey, trimmed);
    setDraft('');
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
    setDraft('');
  }

  if (editing) {
    return (
      <span className="word-img-edit" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="word-img-input"
          placeholder="image URL"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
          }}
        />
        <button className="word-img-save" onClick={save} title="save">
          ✓
        </button>
        <button className="word-img-cancel" onClick={cancel} title="cancel">
          ✕
        </button>
      </span>
    );
  }

  if (url) {
    return (
      <span className={'word-img-wrap' + (size === 'lg' ? ' lg' : '')} onClick={(e) => e.stopPropagation()}>
        <img
          src={url}
          alt=""
          className={'word-img' + (size === 'lg' ? ' lg' : '')}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <button className="word-img-remove" title="remove image" onClick={() => clearImage(imgKey)}>
          ✕
        </button>
      </span>
    );
  }

  return (
    <button
      className="word-img-add"
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="attach a picture by URL"
    >
      + img
    </button>
  );
}
