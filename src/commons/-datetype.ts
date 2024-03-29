/**
 * DECAF FINREA action date type type definition.
 */
export type DateType = 'commitment' | 'settlement';

/**
 * Translation table for DECAF FINREA action date types.
 */
export const DATE_TYPES: { label: string; value: DateType }[] = [
  { label: 'Trade Date', value: 'commitment' },
  { label: 'Value Date', value: 'settlement' },
];
