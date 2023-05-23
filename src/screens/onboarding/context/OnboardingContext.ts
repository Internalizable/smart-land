import { createContext, Dispatch, SetStateAction } from 'react';

export interface IOnboardedUser {
    email: string;
    password: string;
}

interface OnboardingContextType {
    onboardedUser: IOnboardedUser;
    setOnboardedUser: Dispatch<SetStateAction<IOnboardedUser>>;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);
