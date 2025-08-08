import queryString from "query-string";

export const getQueryParams = (queryPath) => {
  return queryString.parse(queryPath.split(/\?/)[1]);
};
export const getQueryString = (queryPath) => {
  let qs = queryPath.split(/\?/)[1];
  return qs ? `?${qs}` : "";
};

export const metaverseRoute = () => {
  const listMetaverse = [
    "jazz", "rugby", "church", "euterpe", "anime", "gym"
  ];
  const domain = typeof window !== 'undefined' ? window.location.hostname : '';
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const metaverseParam = searchParams?.get('metaverse');
  console.log("metaverseParam", metaverseParam, domain);
  if (metaverseParam && listMetaverse.includes(metaverseParam)) {
    return metaverseParam;
  }

  if (domain.includes('rugby')) {
    return 'rugby';
  }
  if (domain.includes('gym')) {
    return 'gym';
  }
  if (domain.includes('imaritone')) {
    return 'church';
  }
  if (domain.includes('stellina')) {
    return 'jazz';
  }
  return "church";
}
