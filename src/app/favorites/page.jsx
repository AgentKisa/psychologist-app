"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, query, limitToFirst } from "firebase/database";
import { useAuth } from "../../utils/auth";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import AppointmentModal from "../../components/Modal/AppointmentModal";
import PsychologistFilter from "@/components/PsychologistFilter/PsychologistFilter";
import { sortAndDisplayPsychologists } from "../../utils/sortPsychologists";
import styles from "./page.module.css";

const FavoritesPage = () => {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [allPsychologists, setAllPsychologists] = useState([]);
  const [displayedPsychologists, setDisplayedPsychologists] = useState([]);
  const [expandedPsychologistId, setExpandedPsychologistId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  const [sortBy, setSortBy] = useState("alphabet");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllPsychologists = async () => {
    const db = getDatabase(
      app,
      "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
    );
    const psychologistsRef = ref(db);
    const psychologistsQuery = query(psychologistsRef, limitToFirst(100));
    const snapshot = await get(psychologistsQuery);

    if (snapshot.exists()) {
      let data = snapshot.val();
      let dataArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setAllPsychologists(dataArray);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      const storedFavorites = localStorage.getItem(`favorites_${user.uid}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      fetchAllPsychologists();
    }
  }, [user, loading]);

  useEffect(() => {
    if (allPsychologists.length > 0) {
      const sortedData = sortAndDisplayPsychologists(
        favoritePsychologists,
        sortBy,
        1,
        favorites,
      );
      setDisplayedPsychologists(sortedData.displayed);
      setHasMore(sortedData.hasMore);
    }
  }, [allPsychologists, favorites, sortBy]);

  const favoritePsychologists = allPsychologists.filter((psychologist) =>
    favorites.includes(psychologist.id),
  );

  const onSort = (sortBy) => {
    const sortedData = sortAndDisplayPsychologists(
      favoritePsychologists,
      sortBy,
      1,
      favorites,
    );
    setDisplayedPsychologists(sortedData.displayed);
    setSortBy(sortBy);
    setPage(1);
  };

  if (!user) {
    alert("You must be logged in to manage favorites.");
    return null;
  }

  const handleExpand = (id) => {
    setExpandedPsychologistId((prevId) => (prevId === id ? null : id));
  };

  const handleOpenModal = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPsychologist(null);
    setIsModalOpen(false);
  };

  const syncFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    if (user) {
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(updatedFavorites),
      );
    }
  };

  const toggleFavorite = (psychologistId) => {
    const updatedFavorites = favorites.includes(psychologistId)
      ? favorites.filter((id) => id !== psychologistId)
      : [...favorites, psychologistId];

    syncFavorites(updatedFavorites);
  };

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);

    const sortedData = sortAndDisplayPsychologists(
      favoritePsychologists,
      sortBy,
      newPage,
    );
    setDisplayedPsychologists(sortedData.displayed);
    setHasMore(sortedData.hasMore);
  };

  return (
    <div className={styles.container}>
      <PsychologistFilter sortBy={sortBy} onSort={onSort} />
      {displayedPsychologists.length === 0 ? (
        <p className={styles.noFavorites}>No favorites added yet.</p>
      ) : (
        <div>
          {displayedPsychologists.map((psychologist, index) => (
            <PsychologistCard
              key={`${psychologist.id}-${index}`}
              psychologist={psychologist}
              isFavorite={true}
              toggleFavorite={toggleFavorite}
              isExpanded={expandedPsychologistId === psychologist.id}
              onExpand={() => handleExpand(psychologist.id)}
              onOpenModal={() => handleOpenModal(psychologist)}
            />
          ))}
          {hasMore && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={!hasMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
      {isModalOpen && selectedPsychologist && (
        <AppointmentModal
          psychologist={selectedPsychologist}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
