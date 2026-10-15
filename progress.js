
const ProgressTracker = (() => {
  const STORAGE_KEY = "mindfulGamesSudokuProgress";

  function loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return { version: 1, sessions: [] };

      const data = JSON.parse(saved);
      if (!Array.isArray(data.sessions)) {
        throw new Error("Invalid progress data");
      }
      return data;
    } catch (error) {
      console.warn("Could not load progress:", error);
      return { version: 1, sessions: [] };
    }
  }

  function saveProgress(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn("Could not save progress:", error);
      return false;
    }
  }

  function recordSession(session) {
    const data = loadProgress();

    data.sessions.push({
      game: "simple-sudoku",
      level: session.level,
      levelName: session.levelName,
      boardSize: session.boardSize,
      completed: true,
      durationSeconds: session.durationSeconds,
      hintsUsed: session.hintsUsed,
      mistakes: session.mistakes,
      completedAt: new Date().toISOString()
    });

    return saveProgress(data);
  }

  function getSessions() {
    return loadProgress().sessions;
  }

  function getStats() {
    const sessions = getSessions().filter(s => s.completed);
    const count = sessions.length;

    const sum = field =>
      sessions.reduce((total, s) => total + (Number(s[field]) || 0), 0);

    return {
      totalPuzzles: count,
      totalHints: sum("hintsUsed"),
      totalMistakes: sum("mistakes"),
      averageHints: count ? +(sum("hintsUsed") / count).toFixed(2) : 0,
      averageMistakes: count ? +(sum("mistakes") / count).toFixed(2) : 0,
      averageTimeSeconds: count ? Math.round(sum("durationSeconds") / count) : 0,
      highestLevel: sessions.reduce(
        (highest, s) => Math.max(highest, s.level), 0
      )
    };
  }

  function getLevelStats(levelNumber) {
    const sessions = getSessions().filter(
      s => s.completed && s.level === levelNumber
    );

    const count = sessions.length;
    const sum = field =>
      sessions.reduce((total, s) => total + (Number(s[field]) || 0), 0);

    return {
      level: levelNumber,
      completed: count,
      averageTimeSeconds: count ? Math.round(sum("durationSeconds") / count) : 0,
      averageHints: count ? +(sum("hintsUsed") / count).toFixed(2) : 0,
      averageMistakes: count ? +(sum("mistakes") / count).toFixed(2) : 0
    };
  }

  function clearProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    recordSession,
    getSessions,
    getStats,
    getLevelStats,
    clearProgress
  };
})();
