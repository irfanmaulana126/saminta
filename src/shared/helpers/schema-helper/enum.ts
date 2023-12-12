export const filterEnumForContainText = (
  search: string = '',
  enumObject: object,
): string[] => {
  if (!search) return [];
  const tes = Object.keys(enumObject).filter((e) =>
    e.includes(search.toUpperCase()),
  );
  return tes.map((e) => enumObject[e]);
};
