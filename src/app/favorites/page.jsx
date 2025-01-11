"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, query, limitToFirst } from "firebase/database";
import { useAuth } from "../../utils/auth";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import styles from "./page.module.css";

const FavoritesPage = () => {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [allPsychologists, setAllPsychologists] = useState([]);

  const fetchAllPsychologists = async () => {
    const db = getDatabase(
      app,
      "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
    );
    const psychologistsRef = ref(db);
    const psychologistsQuery = query(psychologistsRef, limitToFirst(100)); // Modify limit as needed
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

  const favoritePsychologists = allPsychologists.filter((psychologist) =>
    favorites.includes(psychologist.id),
  );

  if (!user) {
    alert("You must be logged in to manage favorites.");
    return null;
  }

  return (
    <div className={styles.container}>
      {favoritePsychologists.length === 0 ? (
        <p className={styles.noFavorites}>No favorites added yet.</p>
      ) : (
        favoritePsychologists.map((psychologist, index) => (
          <PsychologistCard
            key={`${psychologist.id}-${index}`}
            psychologist={psychologist}
            isFavorite={true}
            toggleFavorite={() =>
              setFavorites((prev) =>
                prev.filter((id) => id !== psychologist.id),
              )
            }
          />
        ))
      )}
    </div>
  );
};

export default FavoritesPage;
