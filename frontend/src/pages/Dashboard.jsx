import React, { useEffect, useState } from "react";

function Dashboard() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/repos", { credentials: "include" })
      .then(res => res.json())
      .then(data => setRepos(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your GitHub Repos 🎉</h1>
      {repos.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>{repo.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
