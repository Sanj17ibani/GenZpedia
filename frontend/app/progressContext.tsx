import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { AvatarGender } from './avatarData';

interface UserProfile {
  name: string;
  email: string;
  gender: AvatarGender;
  avatarIndex: number;
  password: string;
}

const emptyProfile: UserProfile = {
  name: '',
  email: '',
  gender: 'prefer_not_to_say',
  avatarIndex: 0,
  password: '',
};

interface ProgressContextType {
  xp: number;
  dailyGoalProgress: number; // 0 to 100
  profile: UserProfile;
  addXp: (amount: number) => void;
  addGoalProgress: (amount: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [xp, setXp] = useState(0);
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const addGoalProgress = (amount: number) => {
    setDailyGoalProgress((prev) => {
      const next = prev + amount;
      return next > 100 ? 100 : next;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const logout = () => {
    setXp(0);
    setDailyGoalProgress(0);
    setProfile(emptyProfile);
  };

  return (
    <ProgressContext.Provider
      value={{
        xp,
        dailyGoalProgress,
        profile,
        addXp,
        addGoalProgress,
        updateProfile,
        logout,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
