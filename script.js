// Base Application Logic
const students = [];

function registerStudent(name, matricNo, programme) {
  students.push({ name, matricNo, programme });
  renderTable();
}

function renderTable() {
  const tableBody = document.querySelector("#student-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = "";
  students.forEach((s) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${s.name}</td><td>${s.matricNo}</td><td>${s.programme}</td>`;
    tableBody.appendChild(row);
  });
}