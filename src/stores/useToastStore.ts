import { create } from 'zustand';

interface ToastState {
  message: string;
  visible: boolean;
  show: (msg: string) => void;
  hide: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  visible: false,
  show: (msg) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message: msg, visible: true });
    hideTimer = setTimeout(() => set({ visible: false }), 3000);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false });
  },
}));
