import React, { useCallback, useEffect, useState } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
const Project = () => {
  const projectCollection = collection(db, "projects");
  const [projects, setProjects] = useState([]);
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");

      const [projectSnapshot] = await Promise.all([getDocs(projectCollection)]);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));
      setProjects(projectData);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify(projectData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

    useEffect(() => {
      fetchData();
    }, [fetchData]);
  
      const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return <div>Project</div>;
};

export default Project;
