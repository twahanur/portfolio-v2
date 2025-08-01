// hooks/useFetchCV.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const useFetchCV = () => {
  const [cv, setCv] = useState(null);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const docSnap = await getDoc(doc(db, "documents", "cv"));
        if (docSnap.exists()) {
          setCv({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Failed to fetch CV:", error);
      }
    };

    fetchCV();
  }, []);

  return cv;
};

export default useFetchCV;
