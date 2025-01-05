import {
  query,
  orderByChild,
  startAfter,
  limitToFirst,
} from "firebase/database";

export const getSortedQuery = (ref, sortBy, lastVisibleValue) => {
  const pageSize = 3; // Количество элементов на странице
  let dbQuery;

  switch (sortBy) {
    case "alphabet":
    case "alphabetDesc":
      dbQuery = orderByChild("name");
      break;
    case "price":
    case "priceDesc":
      dbQuery = orderByChild("price_per_hour");
      break;
    case "popularity":
    case "popularityDesc":
      dbQuery = orderByChild("rating");
      break;
    default:
      dbQuery = orderByChild("name");
  }

  if (lastVisibleValue) {
    return query(
      ref,
      dbQuery,
      startAfter(lastVisibleValue),
      limitToFirst(pageSize),
    );
  }
  return query(ref, dbQuery, limitToFirst(pageSize));
};
