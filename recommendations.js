
const LevelRecommender = (() => {
  const MIN_ATTEMPTS = 3;
  const MAX_LEVEL = 5;

  function getRecentSessions(levelNumber) {
    return ProgressTracker.getSessions()
      .filter(session =>
        session.completed === true &&
        session.level === levelNumber
      )
      .slice(-MIN_ATTEMPTS);
  }

  function average(sessions, field) {
    if (sessions.length === 0) return 0;

    return sessions.reduce(
      (sum, session) => sum + (Number(session[field]) || 0),
      0
    ) / sessions.length;
  }

  function recommend(currentLevelNumber) {
    const sessions = getRecentSessions(currentLevelNumber);

    if (sessions.length < MIN_ATTEMPTS) {
      return {
        level: currentLevelNumber,
        type: "practice",
        title: "Keep Practicing!",
        message:
          `You've completed ${sessions.length} of ${MIN_ATTEMPTS} ` +
          "practice puzzles at this level. Keep going so we can " +
          "learn which challenge works best for you."
      };
    }

    const avgMistakes = average(sessions, "mistakes");
    const avgHints = average(sessions, "hintsUsed");

    const readyToAdvance = sessions.every(
      session =>
        session.mistakes <= 1 &&
        session.hintsUsed <= 1
    );

    if (readyToAdvance && currentLevelNumber < MAX_LEVEL) {
      return {
        level: currentLevelNumber + 1,
        type: "advance",
        title: "Ready for a New Challenge!",
        message:
          "You've completed three puzzles with very few mistakes " +
          "or hints. Would you like to try the next level?"
      };
    }

    if (
      (avgMistakes >= 4 || avgHints >= 3) &&
      currentLevelNumber > 1
    ) {
      return {
        level: currentLevelNumber - 1,
        type: "easier",
        title: "Let's Practice Together!",
        message:
          "This level has been challenging recently. You might " +
          "enjoy practicing an earlier level before trying again."
      };
    }

    if (readyToAdvance && currentLevelNumber === MAX_LEVEL) {
      return {
        level: currentLevelNumber,
        type: "mastered",
        title: "Wonderful Progress!",
        message:
          "You're doing very well on the highest level! " +
          "Keep practicing to maintain your skills."
      };
    }

    return {
      level: currentLevelNumber,
      type: "practice",
      title: "You're Making Progress!",
      message:
        "Keep practicing this level. Every puzzle is another " +
        "opportunity to learn!"
    };
  }

  return { recommend };
})();
