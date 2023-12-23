export const transformValue = ({ value }) => value || undefined;

export const transformToDate = ({ value }) =>
  value ? new Date(value) : undefined;

export const transformToInt = ({ value }) => parseInt(value) || undefined;
