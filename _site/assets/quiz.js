document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    const quizId = quiz.dataset.quizId;
    const submit = quiz.querySelector(".quiz-submit");
    const result = quiz.querySelector(".quiz-result");
    const questions = [...quiz.querySelectorAll("fieldset[data-answer]")];

    const renderSavedScore = () => {
      if (!quizId) return;
      const saved = window.localStorage.getItem(`kipp-quiz-${quizId}`);
      if (!saved) return;
      try {
        const data = JSON.parse(saved);
        result.textContent = `Skor terakhir di perangkat ini: ${data.score}/${data.total}.`;
      } catch (_) {
        window.localStorage.removeItem(`kipp-quiz-${quizId}`);
      }
    };

    submit?.addEventListener("click", () => {
      let score = 0;
      let answered = 0;

      questions.forEach((question) => {
        question.classList.remove("is-correct", "is-incorrect");
        const selected = question.querySelector("input:checked");
        if (!selected) return;

        answered += 1;
        const correct = selected.value === question.dataset.answer;
        question.classList.add(correct ? "is-correct" : "is-incorrect");
        if (correct) score += 1;
      });

      if (answered !== questions.length) {
        result.textContent = `Jawab seluruh pertanyaan terlebih dahulu (${answered}/${questions.length}).`;
        return;
      }

      result.textContent = `Skor formatif: ${score}/${questions.length}. Tinjau kembali pertanyaan yang ditandai.`;
      if (quizId) {
        window.localStorage.setItem(
          `kipp-quiz-${quizId}`,
          JSON.stringify({ score, total: questions.length, savedAt: new Date().toISOString() })
        );
      }
    });

    renderSavedScore();
  });
});

