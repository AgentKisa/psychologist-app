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
    if (user && !loading) {
      fetchAllPsychologists();
      const storedFavorites = localStorage.getItem(`favorites_${user.uid}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, [user, loading]);

  const fetchAllPsychologists = async () => {
    setLoadingPsychologists(true);

    try {
      const psychologistsQuery = query(psychologistsRef, limitToFirst(100)); // Загружаем все данные
      const snapshot = await get(psychologistsQuery);

      if (snapshot.exists()) {
        let data = snapshot.val();
        let dataArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        const sortedData = sortAndDisplayPsychologists(dataArray, sortBy, 1);
        setAllPsychologists(dataArray); // Сохраняем все данные
        setDisplayedPsychologists(sortedData.displayed); // Отображаем первые 3 элемента
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

  // Функция для управления добавлением/удалением из избранного
  const toggleFavorite = (psychologistId) => {
    const updatedFavorites = favorites.includes(psychologistId)
      ? favorites.filter((id) => id !== psychologistId)
      : [...favorites, psychologistId];

    console.log("Updated favorites:", updatedFavorites);
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
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <PsychologistFilter sortBy={sortBy} onSort={onSort} />

      {loadingPsychologists && displayedPsychologists.length === 0 ? (
        <div>Loading psychologists...</div>
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
            <button onClick={handleLoadMore} disabled={loadingPsychologists}>
              {loadingPsychologists ? "Loading..." : "Load More"}
            </button>
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
