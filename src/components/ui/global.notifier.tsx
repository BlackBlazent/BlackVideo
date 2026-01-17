// global.notifier.tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import React, { useEffect, useState } from 'react';
import { notifier, Notification } from '../../../scripts/global.notifier.store';
import { CheckCircle2, AlertCircle, Info, X, Camera } from 'lucide-react';
import '../../styles/utils/global.notifier.css';

export const GlobalNotifier: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    return notifier.subscribe((newItems: Notification[]) => setItems(newItems));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="globalNotifier">
      <div className="globalSystemhandler">
        {items.map((note) => (
          <div key={note.id} className={`notifier-card ${note.type}`}>
            <div className="notifier-icon">
              {note.type === 'success' && <CheckCircle2 size={18} />}
              {note.type === 'error' && <AlertCircle size={18} />}
              {note.type === 'info' && <Info size={18} />}
              {note.type === 'warning' && <AlertCircle size={18} />}
              {note.type === 'saved' && <Camera size={18} />}
            </div>
            
            <div className="notifier-body">
              <h4 className="notifier-title">{note.title}</h4>
              <div className="notifier-description">{note.description}</div>
            </div>

            <button className="notifier-close-btn" onClick={() => notifier.remove(note.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};