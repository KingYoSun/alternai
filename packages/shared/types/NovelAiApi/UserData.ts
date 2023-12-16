export interface PriorityResponse {
  maxPriorityActions: number;
  nextRefillAt: number;
  taskPriority: number;
}

export const InitialPriorityResponse: PriorityResponse = {
  maxPriorityActions: 0,
  nextRefillAt: 0,
  taskPriority: 0,
};

interface ImageGenerationLimits {
  maxPrompts: number;
  resolution: number;
}

export interface Perks {
  maxPriorityActions: number; // Amount of max priority actions
  startPriority: number; // Start priority amount
  contextTokens: number; // Amount of granted context tokens
  unlimitedMaxPriority: boolean; // Is max priority unlimited
  moduleTrainingSteps: number; // Amount of module training steps granted every month
  imageGeneration: boolean;
  unlimitedImageGeneration: boolean;
  unlimitedImageGenerationLimits: ImageGenerationLimits[];
  voiceGeneration: boolean;
}

export const InitialPerks: Perks = {
  maxPriorityActions: 1000,
  startPriority: 10,
  contextTokens: 0,
  unlimitedMaxPriority: false,
  moduleTrainingSteps: 0,
  imageGeneration: true,
  unlimitedImageGeneration: false,
  unlimitedImageGenerationLimits: [
    {
      maxPrompts: 0,
      resolution: 4194304,
    },
    {
      maxPrompts: 1,
      resolution: 1048576,
    },
  ],
  voiceGeneration: true,
};

export interface TrainingStepsLeft {
  fixedTrainingStepsLeft: number; // Amount of available fixed module training steps left (reset every month)
  purchasedTrainingSteps: number; // Amount of available purchased module training steps left
}

export const InitialTrainingStepsLeft: TrainingStepsLeft = {
  fixedTrainingStepsLeft: 0,
  purchasedTrainingSteps: 0,
};

export interface SubscriptionResponse {
  tier: number; // Subscription internal tier number, see SubscriptionTiers enum
  active: boolean; // Is subscription active as of the moment of the request
  expiresAt: number; // UNIX timestamp of subscription expiration
  perks: Perks;
  paymentProcessorData: object; // ?
  trainingStepsLeft: TrainingStepsLeft;
}

export const InitialSubscriptionResponse: SubscriptionResponse = {
  tier: 0,
  active: false,
  expiresAt: 0,
  perks: InitialPerks,
  paymentProcessorData: {},
  trainingStepsLeft: InitialTrainingStepsLeft,
};

export interface GetKeyStoreResponse {
  keystore?: string;
}

export const InitialGetKeyStoreResponse: GetKeyStoreResponse = {};

export interface AccountInformationResponse {
  emailVerified: boolean;
  emailVerificationLetterSent: boolean;
  trialActivated: boolean;
  trialActionsLeft: number;
  trialImagesLeft: number;
  accountCreatedAt: number;
}

export const InitialAccountInformationResponse: AccountInformationResponse = {
  emailVerified: false,
  emailVerificationLetterSent: false,
  trialActivated: false,
  trialActionsLeft: 0,
  trialImagesLeft: 0,
  accountCreatedAt: 0,
};

export interface UserAccountDataResponse {
  priority: PriorityResponse;
  subscription: SubscriptionResponse;
  keystore?: GetKeyStoreResponse;
  settings?: string;
  infomation: AccountInformationResponse;
}

export const InitialUserAccountData: UserAccountDataResponse = {
  priority: InitialPriorityResponse,
  subscription: InitialSubscriptionResponse,
  infomation: InitialAccountInformationResponse,
};
