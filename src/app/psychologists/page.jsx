"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, query, limitToFirst } from "firebase/database";
import { useAuth } from "../../utils/auth";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import AppointmentModal from "../../components/Modal/AppointmentModal";

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
  const [allPsychologists, setAllPsychologists] = useState([]); // Состояние для всех данных
  const [displayedPsychologists, setDisplayedPsychologists] = useState([]); // Состояние для отображаемых данных
  const [loadingPsychologists, setLoadingPsychologists] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("alphabet");
  const [page, setPage] = useState(1); // Состояние для номера страницы
  const [expandedPsychologistId, setExpandedPsychologistId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);

  const handleExpand = (id) => {
    setExpandedPsychologistId((prevId) => (prevId === id ? null : id));
  };

  const handleFilterChange = (e) => {
    setSortBy(e.target.value);
    sortAndDisplayPsychologists(e.target.value, 1);
    setPage(1);
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

        sortDataArray(dataArray, sortBy);
        setAllPsychologists(dataArray); // Сохраняем все данные
        setDisplayedPsychologists(dataArray.slice(0, 3)); // Отображаем первые 3 элемента
        setHasMore(dataArray.length > 3);
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

    const sortedPsychologists = [...allPsychologists];
    sortDataArray(sortedPsychologists, sortBy);

    const newPsychologists = sortedPsychologists.slice(0, newPage * 3);
    setDisplayedPsychologists(newPsychologists);
    setHasMore(newPsychologists.length < allPsychologists.length);
  };

  const sortDataArray = (dataArray, sortBy) => {
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
      dataArray.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "popularityDesc") {
      dataArray.sort((a, b) => b.rating - a.rating);
    }
  };

  const sortAndDisplayPsychologists = (sortBy, page) => {
    const sortedPsychologists = [...allPsychologists];
    sortDataArray(sortedPsychologists, sortBy);
    setDisplayedPsychologists(sortedPsychologists.slice(0, page * 3));
    setHasMore(sortedPsychologists.length > page * 3);
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
      <h1>Psychologists</h1>

      <select onChange={handleFilterChange} value={sortBy}>
        <option value="alphabet">Sort by Alphabet (A to Z)</option>
        <option value="alphabetDesc">Sort by Alphabet (Z to A)</option>
        <option value="price">Sort by Price (Low to High)</option>
        <option value="priceDesc">Sort by Price (High to Low)</option>
        <option value="popularity">
          Sort by Popularity (Lowest to Highest)
        </option>
        <option value="popularityDesc">
          Sort by Popularity (Highest to Lowest)
        </option>
      </select>

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
              onOpenModal={handleOpenModal} // Передаем функцию открытия модального окна
            />
          ))}
          {hasMore && (
            <button onClick={handleLoadMore} disabled={loadingPsychologists}>
              {loadingPsychologists ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}

      {isModalOpen &&
        selectedPsychologist && ( // Проверяем, открыто ли модальное окно и выбран ли психолог
          <AppointmentModal
            psychologist={selectedPsychologist} // Передаем выбранного психолога
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
    </div>
  );
};

export default PsychologistsPage;
