export function createQuiz({ structures, scoreDisplay, prompt, status, onTargetChange }) {
  let active = false;
  let score = 0;
  let current = null;

  function pickQuestion() {
    current = structures[Math.floor(Math.random() * structures.length)];
    prompt.textContent = `Identify: ${current.quizName}`;
    status.textContent = `Quiz mode: click the ${current.quizName}.`;
    onTargetChange?.(current.key);
  }

  function setActive(value) {
    active = value;
    if (active) {
      pickQuestion();
    } else {
      current = null;
      prompt.textContent = 'Switch to Landmark Quiz to begin.';
      status.textContent = 'Explorer mode: inspect labelled anatomy.';
      onTargetChange?.(null);
    }
  }

  function handleSelection(mesh) {
    if (!active || !mesh?.userData?.interactive) return;
    if (mesh.userData.key === current.key) {
      score += 10;
      status.textContent = `Correct: ${mesh.userData.quizName}. +10 points.`;
      pickQuestion();
    } else {
      score -= 2;
      status.textContent = `Try again. ${mesh.userData.quizName} is not the requested landmark. −2 points.`;
    }
    scoreDisplay.textContent = score;
  }

  return { setActive, handleSelection };
}
