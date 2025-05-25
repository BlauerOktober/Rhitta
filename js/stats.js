  async function loadStats() {
    try {
      const response = await fetch("https://sismargaret.fact0rn.io/api/public/deadpool/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();

      // Helper function to set the value above the label
      const setStat = (id, label, value) => {
        document.getElementById(id).innerHTML = `<strong>${value}</strong><br><em>${label}</em>`;
      };

      // Set individual stats
      setStat("stas_publications", "Total Publications", data.publications);
      setStat("stas_solved", "Total Solved", data.solved);
      setStat("stas_contested", "Total Contested", data.contested);
      setStat("stas_awaiting", "Total Awaiting", data.awaiting);

      // Calculate and set total jobs
      const totalJobs = data.publications + data.contested + data.awaiting;
      setStat("stas_jobs", "Total Jobs", totalJobs);

    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", loadStats);