/* ===============================
   CONFIG & AUTH
================================ */
const API_URL = "http://localhost:5151/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// Sample data for demo (replace with real API calls)
/* ===============================
   SAMPLE DATA FOR DEMO
================================ */
const demoExams = [
  {
    id: 1,
    title: "DBMS",
    totalMarks: 100,
    duration: 60
  },
  {
    id: 2,
    title: "Java Programming",
    totalMarks: 100,
    duration: 90
  }
];

const demoQuestions = [
  {
    id: 1,
    subject: "DBMS",
    totalQuestions: 40
  },
  {
    id: 2,
    subject: "Java",
    totalQuestions: 50
  }
];

/* ===============================
   FETCH & UPDATE STATS
================================ */
function updateStats() {
  // Real API call
  fetch(`${API_URL}/StudentStats`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(stats => {
    document.getElementById("totalExams").innerText = stats.availableExams ?? 5;
    document.getElementById("totalQuestions").innerText = stats.totalQuestions ?? 120;
    document.getElementById("totalStudents").innerText = stats.totalStudents ?? 80;
    document.getElementById("examsConducted").innerText = stats.examsConducted ?? 18;
  })
  .catch(() => {
    // Demo fallback
    document.getElementById("totalExams").innerText = 5;
    document.getElementById("totalQuestions").innerText = 120;
    document.getElementById("totalStudents").innerText = 80;
    document.getElementById("examsConducted").innerText = 18;
  });
}

/* ===============================
   LOAD EXAMS
================================ */
function loadExams() {
  // Real API call
  fetch(`${API_URL}/Exams`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(exams => {
    displayExams(exams || demoExams);
  })
  .catch(() => {
    displayExams(demoExams);
  });
}

function displayExams(exams) {
  const examList = document.getElementById("examList");
  examList.innerHTML = exams.map(exam => `
    <div class="exam-card">
      <div>
        <strong>${exam.title}</strong>
        <br><small>Marks: ${exam.totalMarks} | Time: ${exam.duration} mins</small>
      </div>
      <div>
        <button class="btn-success" onclick="editExam(${exam.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-danger" onclick="deleteExam(${exam.id})" style="margin-left: 10px;">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');
}

/* ===============================
   LOAD QUESTION BANK
================================ */
function loadQuestionBank() {
  const questionBank = document.getElementById("questionBank");
  questionBank.innerHTML = demoQuestions.map(q => `
    <div class="exam-card">
      <div>
        <strong>${q.subject}</strong>
        <br><small>Total Questions: ${q.totalQuestions}</small>
      </div>
      <div>
        <button class="btn-success" onclick="addQuestion(${q.id})">
          <i class="fas fa-plus"></i> Add Question
        </button>
        <button class="btn-info" onclick="viewQuestions(${q.id})" style="margin-left: 10px;">
          <i class="fas fa-eye"></i> View
        </button>
      </div>
    </div>
  `).join('');
}

/* ===============================
   EVENT FUNCTIONS
================================ */
function createExam() {
  alert("Create new exam functionality");
}

function editExam(id) {
  alert(`Edit exam ${id}`);
}

function deleteExam(id) {
  if (confirm(`Delete exam ${id}?`)) {
    alert(`Exam ${id} deleted`);
  }
}

function addQuestion(id) {
  alert(`Add question to bank ${id}`);
}

function viewQuestions(id) {
  alert(`View questions for bank ${id}`);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* ===============================
   INIT
================================ */
document.addEventListener('DOMContentLoaded', function() {
  updateStats();
  loadExams();
  loadQuestionBank();
});
