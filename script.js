/* ===== SHARED SETUP & STORAGE ===== */
const STORAGE_KEY = "sim_students_group_five";
let students = [];

const form = document.getElementById("student-form");
const fullNameInput = document.getElementById("full-name");
const matricInput = document.getElementById("matric-number");
const programmeInput = document.getElementById("programme");
const formMessage = document.getElementById("form-message");
const tableBody = document.getElementById("students-body");
const emptyMessage = document.getElementById("empty-message");
const studentCount = document.getElementById("student-count");
const studentsTable = document.getElementById("students-table");

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    showFormMessage("Could not save to browser storage.", "error");
  }
}

/* ===== REGISTRATION FORM LOGIC (Owner: Usman Aliyu Jibril) ===== */
function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = "form-message " + type;
}

function setFieldError(input, text) {
  document.getElementById(input.id + "-error").textContent = text;
  input.classList.toggle("input-invalid", text !== "");
}

function clearErrors() {
  [fullNameInput, matricInput, programmeInput].forEach(function (input) {
    setFieldError(input, "");
  });
  showFormMessage("", "");
}

function isDuplicateMatric(matric) {
  return students.some(function (s) {
    return s.matricNumber.toUpperCase() === matric.toUpperCase();
  });
}

function validateForm(name, matric, programme) {
  let valid = true;
  if (name === "") { setFieldError(fullNameInput, "Full name is required."); valid = false; }
  if (matric === "") {
    setFieldError(matricInput, "Matriculation number is required.");
    valid = false;
  } else if (isDuplicateMatric(matric)) {
    setFieldError(matricInput, "This matriculation number is already registered.");
    valid = false;
  }
  if (programme === "") { setFieldError(programmeInput, "Please select a programme."); valid = false; }
  return valid;
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearErrors();

  const name = fullNameInput.value.trim();
  const matric = matricInput.value.trim().toUpperCase();
  const programme = programmeInput.value;

  if (!validateForm(name, matric, programme)) {
    showFormMessage("Please fix the errors above.", "error");
    return;
  }

  students.push({ fullName: name, matricNumber: matric, programme: programme });
  saveStudents();
  renderTable();
  form.reset();
  showFormMessage("Student registered successfully.", "success");
  fullNameInput.focus();
}

/* ===== RECORDS TABLE LOGIC (Owner: Luqman Yusuf) ===== */
function createRow(student) {
  const row = document.createElement("tr");
  const values = [
    ["Name", student.fullName],
    ["Matriculation Number", student.matricNumber],
    ["Programme", student.programme]
  ];

  values.forEach(function (pair) {
    const cell = document.createElement("td");
    cell.setAttribute("data-label", pair[0]);
    cell.textContent = pair[1];
    row.appendChild(cell);
  });

  const actionCell = document.createElement("td");
  actionCell.setAttribute("data-label", "Action");
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("aria-label", "Delete " + student.fullName);
  deleteBtn.addEventListener("click", function () {
    deleteStudent(student.matricNumber);
  });
  actionCell.appendChild(deleteBtn);
  row.appendChild(actionCell);

  return row;
}

function renderTable() {
  tableBody.innerHTML = "";
  students.forEach(function (student) {
    tableBody.appendChild(createRow(student));
  });
  studentCount.textContent = students.length;
  const isEmpty = students.length === 0;
  emptyMessage.hidden = !isEmpty;
  studentsTable.hidden = isEmpty;
}

function deleteStudent(matric) {
  const target = students.find(function (s) { return s.matricNumber === matric; });
  if (!target) return;
  const confirmed = window.confirm("Delete " + target.fullName + " (" + target.matricNumber + ")? This cannot be undone.");
  if (!confirmed) return;
  students = students.filter(function (s) { return s.matricNumber !== matric; });
  saveStudents();
  renderTable();
  showFormMessage("Record deleted.", "success");
}

/* ===== APP START-UP (By Isaac Asuku Stephen) ===== */
form.addEventListener("submit", handleFormSubmit);
students = loadStudents();
renderTable();
