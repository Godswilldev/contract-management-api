export const getCorrectObject = (array: string[], queryObj: Record<any, any>) => {
  const obj: any = {};
  for (const key in queryObj) {
    if (array.includes(String(key))) {
      obj[key] = queryObj[key];
    }
  }
  return obj;
};
