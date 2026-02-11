export const CLAIM_TYPES = {
  MOBILE: 'Mobile',
  BROADBAND: 'Broadband',
} as const;

export const CLAIM_LIMITS = {
  [CLAIM_TYPES.MOBILE]: 350,
  [CLAIM_TYPES.BROADBAND]: 650,
};

export const RETURN_PERCENTAGE = 0.83;
