import { useAppStore } from "@/lib/store";

const SOUNDS = {
  spin: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  loss: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  drop: 'https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3',
  roll: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
};

export function useAudio() {
  const { isMuted } = useAppStore();

  const playSound = (soundKey: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const audio = new Audio(SOUNDS[soundKey]);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore autoplay blocks
  };

  return { playSound };
}
