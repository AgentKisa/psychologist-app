import React, { useEffect, useRef, useState } from "react";
import styles from "./PsychologistFilter.module.css";

const PsychologistFilter = ({ sortBy, onSort }) => {
  const [selectedSortBy, setSelectedSortBy] = useState(sortBy || "alphabet");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleFilterChange = (newSortBy) => {
    setSelectedSortBy(newSortBy);
    onSort(newSortBy, 1);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  return (
    <article className={styles.filterDiv}>
      <div className={styles.filter}>
        <h2 className={styles.filterTitle}>Filters</h2>
        <div
          onClick={toggleOpen}
          ref={selectRef}
          className={styles.filterContainer}
        >
          <div className={styles.selectedOption}>
            {selectedSortBy === "alphabet" && "A to Z"}
            {selectedSortBy === "alphabetDesc" && "Z to A"}
            {selectedSortBy === "price" && "Less than 10$"}
            {selectedSortBy === "priceDesc" && "Greater than 10$"}
            {selectedSortBy === "popularity" && "Popular"}
            {selectedSortBy === "popularityDesc" && "Not Popular"}
            <svg width="14" height="14" className={styles.arrowIcon}>
              <use
                href={
                  isOpen
                    ? "/sprite.svg#icon-chevron-up"
                    : "/sprite.svg#icon-chevron-down"
                }
              ></use>
            </svg>
          </div>
          {isOpen && (
            <div className={styles.optionsList}>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("alphabet")}
              >
                A to Z
              </div>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("alphabetDesc")}
              >
                Z to A
              </div>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("price")}
              >
                Less than 10$
              </div>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("priceDesc")}
              >
                Greater than 10$
              </div>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("popularity")}
              >
                Popular
              </div>
              <div
                className={styles.option}
                onClick={() => handleFilterChange("popularityDesc")}
              >
                Not Popular
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PsychologistFilter;
