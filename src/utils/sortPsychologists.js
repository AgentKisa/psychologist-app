export const sortPsychologists = (dataArray, sortBy) => {
  if (sortBy === "alphabet") {
    dataArray.sort((a, b) =>
      a.name.localeCompare(b.name, "ru-RU", { sensitivity: "base" }),
    );
  } else if (sortBy === "alphabetDesc") {
    dataArray.sort((a, b) =>
      b.name.localeCompare(a.name, "ru-RU", { sensitivity: "base" }),
    );
  } else if (sortBy === "price") {
    dataArray.sort((a, b) => a.price_per_hour - b.price_per_hour);
  } else if (sortBy === "priceDesc") {
    dataArray.sort((a, b) => b.price_per_hour - a.price_per_hour);
  } else if (sortBy === "popularity") {
    dataArray.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "popularityDesc") {
    dataArray.sort((a, b) => a.rating - b.rating);
  }
};

export const sortAndDisplayPsychologists = (dataArray, sortBy, page) => {
  const sortedPsychologists = [...dataArray];
  sortPsychologists(sortedPsychologists, sortBy);
  return {
    displayed: sortedPsychologists.slice(0, page * 3),
    hasMore: sortedPsychologists.length > page * 3,
  };
};
