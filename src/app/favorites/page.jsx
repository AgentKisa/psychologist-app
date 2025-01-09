"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, get, query, limitToFirst } from "firebase/database";
import { useAuth } from "../../utils/auth";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";

const FavoritesPage = () => {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [allPsychologists, setAllPsychologists] = useState([]);

  // Fetch all psychologists from Firebase
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
    <div>
      <h1>Favorites</h1>
      {favoritePsychologists.length === 0 ? (
        <p>No favorites added yet.</p>
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
