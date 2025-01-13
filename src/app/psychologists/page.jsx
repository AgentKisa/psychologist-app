"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, query, limitToFirst } from "firebase/database";
import { useAuth } from "../../utils/auth";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import AppointmentModal from "../../components/Modal/AppointmentModal";
import PsychologistFilter from "@/components/PsychologistFilter/PsychologistFilter";
import {
  sortAndDisplayPsychologists,
  getSortedQuery,
} from "../../utils/sortPsychologists";
import styles from "./page.module.css";
import Loader from "@/components/Loader/Loader";

const PsychologistsPage = () => {
  let db;
  let psychologistsRef;
  if (app) {
    db = getDatabase(
      app,
      "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
    );
    psychologistsRef = ref(db);
  }

  const { user, loading } = useAuth();
  const [allPsychologists, setAllPsychologists] = useState([]);
  const [displayedPsychologists, setDisplayedPsychologists] = useState([]);
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("alphabet");
  const [page, setPage] = useState(1);
  const [expandedPsychologistId, setExpandedPsychologistId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  const handleExpand = (id) => {
    setExpandedPsychologistId((prevId) => (prevId === id ? null : id));
  };

  const onSort = (sortBy, page) => {
    const sortedData = sortAndDisplayPsychologists(
      allPsychologists,
      sortBy,
      page,
    );
    setDisplayedPsychologists(sortedData.displayed);
    setHasMore(sortedData.hasMore);
    setSortBy(sortBy);
    setPage(page);
  };

  useEffect(() => {
    fetchAllPsychologists();
    if (user && !loading) {
      const storedFavorites = localStorage.getItem(`favorites_${user.uid}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [user, loading]);

  const fetchAllPsychologists = async () => {
    setLoadingPsychologists(true);

    try {
      const psychologistsQuery = query(psychologistsRef, limitToFirst(100));
      const snapshot = await get(psychologistsQuery);

      if (snapshot.exists()) {
        let data = snapshot.val();
        let dataArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        const sortedData = sortAndDisplayPsychologists(dataArray, sortBy, 1);
        setAllPsychologists(dataArray);
        setDisplayedPsychologists(sortedData.displayed);
        setHasMore(sortedData.hasMore);
      } else {
        setAllPsychologists([]);
        setDisplayedPsychologists([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching psychologists:", error);
    } finally {
      setLoadingPsychologists(false);
    }
  };

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);

    const sortedData = sortAndDisplayPsychologists(
      allPsychologists,
      sortBy,
      newPage,
    );
    setDisplayedPsychologists(sortedData.displayed);
    setHasMore(sortedData.hasMore);
  };

  const toggleFavorite = (psychologistId) => {
    const updatedFavorites = favorites.includes(psychologistId)
      ? favorites.filter((id) => id !== psychologistId)
      : [...favorites, psychologistId];
    setFavorites(updatedFavorites);
    if (user) {
      localStorage.setItem(
        `favorites_${user.uid}`,
        JSON.stringify(updatedFavorites),
      );
    }
  };

  const handleOpenModal = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPsychologist(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <PsychologistFilter sortBy={sortBy} onSort={onSort} />

      {loadingPsychologists && displayedPsychologists.length === 0 ? (
        <Loader />
      ) : (
        <div>
          {displayedPsychologists.map((psychologist, index) => (
            <PsychologistCard
              key={`${psychologist.id}-${index}`}
              psychologist={psychologist}
              isExpanded={expandedPsychologistId === psychologist.name}
              onExpand={() => handleExpand(psychologist.name)}
              isFavorite={favorites.includes(psychologist.id)}
              toggleFavorite={() => toggleFavorite(psychologist.id)}
              onOpenModal={handleOpenModal}
            />
          ))}
          {hasMore && (
            <div className={styles.buttonContainer}>
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={loadingPsychologists}
              >
                {loadingPsychologists ? "Loading..." : "Load More"}
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

export default PsychologistsPage;
