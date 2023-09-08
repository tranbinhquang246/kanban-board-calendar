import { format } from "date-fns";

export const createArrayOfObjects = (numDays: any) => {
  const result: any = [];
  numDays.map((element: any) => {
    result.push({
      id: format(new Date(element), "yyyy/MM/dd"),
      title:
        format(new Date(element), "dd") +
        " Date " +
        `(${format(new Date(element), "EEE")})`,
    });
  });
  return result;
};

export const flattenArray = (array: any) => {
  return [].concat(...array);
};
