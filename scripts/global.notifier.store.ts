// global.notifier.store.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'saved';

export interface Notification {
  id: string;
  title: string;
  description: string | ReactNode; // Allow UI components
  type: NotificationType;
}

type Listener = (notifications: Notification[]) => void;
let listeners: Listener[] = [];
let notifications: Notification[] = [];

export const notifier = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  
  notify: (title: string, description: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNote = { id, title, description, type };
    notifications = [...notifications, newNote];
    listeners.forEach((l) => l(notifications));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notifications = notifications.filter((n) => n.id !== id);
      listeners.forEach((l) => l(notifications));
    }, 5000);
  },
  remove: (id: string) => {
    notifications = notifications.filter((n) => n.id !== id);
    listeners.forEach((l) => l(notifications));
  },
};