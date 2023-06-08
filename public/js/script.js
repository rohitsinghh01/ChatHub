const labels = document.querySelectorAll(".form-control label");

labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split("")
    .map(
      (letter, idx) =>
        `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
    )
    .join("");
});

const form = document.forms.login;
function handleSubmit(event) {
  const formData = new FormData(event.target);
  const data = [...formData.entries()];
  localStorage.setItem("gender", data[2][1]);
}
form.addEventListener('submit', handleSubmit);
