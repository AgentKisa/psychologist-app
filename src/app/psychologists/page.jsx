"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../utils/auth"; // Import useAuth hook
import {
  getDatabase,
  ref,
  query,
  orderByKey,
  limitToFirst,
  startAfter,
  get,
} from "firebase/database";
import { app } from "../../utils/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";

const PsychologistsPage = () => {
  let db;
  let psychologistsRef;
  if (app) {
    db = getDatabase(
      app,
      "https://psychologist-app-e21ac-default-rtdb.europe-west1.firebasedatabase.app",
    );
    psychologistsRef = ref(db); // Путь к данным психологов
  }

  const { user, loading } = useAuth(); // Get user and loading state from useAuth
  const [psychologists, setPsychologists] = useState([]); // State for psychologists data
  const [loadingPsychologists, setLoadingPsychologists] = useState(false); // State for psychologist data loading
  const [lastVisibleKey, setLastVisibleKey] = useState(null); // Last key for pagination
  const [hasMore, setHasMore] = useState(true); // Check if there are more psychologists to load

  // Fetch psychologists when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      fetchPsychologists();
    }
  }, [user, loading]);

  // Initial fetch or pagination
  const fetchPsychologists = async (isPagination = false) => {
    if (loadingPsychologists) return;

    setLoadingPsychologists(true);

    try {
      // Query for psychologists
      const psychologistsQuery = isPagination
        ? query(
            psychologistsRef,
            orderByKey(),
            startAfter(lastVisibleKey), // Continue after last visible key
            limitToFirst(3),
          )
        : query(psychologistsRef, orderByKey(), limitToFirst(3)); // Initial fetch

      const snapshot = await get(psychologistsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        setPsychologists((prev) =>
          isPagination ? [...prev, ...formattedData] : formattedData,
        );

        // Update `lastVisibleKey` for pagination
        const lastKey = Object.keys(data).pop();
        setLastVisibleKey(lastKey);

        // Check if there are more items to load
        setHasMore(Object.keys(data).length === 3);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching psychologists:", error);
    } finally {
      setLoadingPsychologists(false);
    }
  };

  // Handle "Load More" button
  const handleLoadMore = () => {
    fetchPsychologists(true);
  };

  // Render loading state
  if (loading) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h1>Psychologists</h1>
      {loadingPsychologists && psychologists.length === 0 ? (
        <div>Loading psychologists...</div>
      ) : (
        <div>
          {psychologists.map((psychologist) => (
            <PsychologistCard
              key={psychologist.id}
              psychologist={psychologist}
            />
          ))}
          {hasMore && (
            <button onClick={handleLoadMore} disabled={loadingPsychologists}>
              {loadingPsychologists ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PsychologistsPage;
