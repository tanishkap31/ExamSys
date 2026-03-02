/* =====================================
   CONFIG & AUTH CHECK
===================================== */
const API_URL = "http://localhost:5151/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

// Demo data
const demoData = {
  stats: {
    upcomingExams: 3,
    completedExams: 12,
    avgScore: 78,
    rank: 12
  },
  exams: [
    {
      id: 1,
      title: "DBMS Final Exam",
      totalMarks: 100,
      duration: 60,
      status: "upcoming",
      date: "Feb 25, 2026"
    },
    {
      id: 2,
      title: "Java Programming",
      totalMarks: 100,
      duration: 90,
      status: "live",
      date: "Now Live"
    },
    {
      id: 3,
      title: "Web Development",
      totalMarks: 100,
      duration: 75,
      status: "upcoming",
      date: "Feb 28, 2026"
    }
  ],
  results: [
    {
      subject: "DBMS",
      score: 88,
      total: 100,
      date: "Feb 15, 2026",
      status: "excellent"
    },
    {
      subject: "Java",
      score: 74,
      total: 100,
      date: "Feb 10, 2026",
      status: "good"
    },
    {
      subject: "C Programming",
      score: 68,
      total: 100,
      date: "Feb 5, 2026",
      status: "needs-work"
    }
  ]
};

/* =====================================
   LOAD DASHBOARD DATA
===================================== */
document.addEventListener('DOMContentLoaded', function() {
  loadStats();
  loadExams();
  loadResults();
});

function loadStats() {
  // API call
  fetch(`${API_URL}/StudentStats`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(stats => {
    document.getElementById("upcomingExams").innerText = stats.upcomingExams ?? demoData.stats.upcomingExams;
    document.getElementById("completedExams").innerText = stats.completedExams ?? demoData.stats.completedExams;
    document.getElementById("avgScore").innerText = stats.avgScore ? `${stats.avgScore}%` : `${demoData.stats.avgScore}%`;
    document.getElementById("rank").innerText = `#${stats.rank ?? demoData.stats.rank}`;
  })
  .catch(() => {
    // Demo fallback
    document.getElementById("upcomingExams").innerText = demoData.stats.upcomingExams;
    document.getElementById("completedExams").innerText = demoData.stats.completedExams;
    document.getElementById("avgScore").innerText = `${demoData.stats.avgScore}%`;
    document.getElementById("rank").innerText = `#${demoData.stats.rank}`;
  });
}

function loadExams() {
  fetch(`${API_URL}/Exams`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(exams => {
    displayExams(exams || demoData.exams);
  })
  .catch(() => {
    displayExams(demoData.exams);
  });
}

function displayExams(exams) {
  const examList = document.getElementById("examList");
  examList.innerHTML = exams.map(exam => `
    <div class="exam-card ${exam.status}">
      <div class="exam-info">
        <strong>${exam.title}</strong>
        <div class="exam-meta">
          <span>Marks: ${exam.totalMarks}</span> | 
          <span>Time: ${exam.duration} mins</span> | 
          <span>${exam.date}</span>
        </div>
      </div>
      <div class="exam-actions">
        ${exam.status === 'live' ? 
          `<button class="btn-start" onclick="startExam(${exam.id})">
            <i class="fas fa-play"></i> Start Now
          </button>` : 
          `<button class="btn-view" onclick="viewExam(${exam.id})">
            <i class="fas fa-eye"></i> View Details
          </button>`
        }
      </div>
    </div>
  `).join('');
}

function loadResults() {
  fetch(`${API_URL}/ExamAttempts`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(results => {
    displayResults(results || demoData.results);
  })
  .catch(() => {
    displayResults(demoData.results);
  });
}

function displayResults(results) {
  const resultsContainer = document.getElementById("recentResults");
  resultsContainer.innerHTML = results.slice(0, 3).map(result => `
    <div class="result-row">
      <div class="result-subject">${result.subject}</div>
      <div class="result-score">
        <span>${result.score}/${result.total}</span>
        <div class="score-badge score-${result.status}">${result.status.toUpperCase()}</div>
      </div>
      <div class="result-date">${result.date}</div>
    </div>
  `).join('');
}

/* =====================================
   ACTION FUNCTIONS
===================================== */
function startExam(examId) {
  fetch(`${API_URL}/ExamAttempts/start/${examId}`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    window.location.href = `exam.html?attemptId=${data.attemptId}`;
  })
  .catch(err => {
    alert("Unable to start exam. Please try again.");
  });
}

function viewExam(examId) {
  alert(`Exam details for ID: ${examId}`);
}

function showNotifications() {
  alert("Notifications coming soon!");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "../login.html";
}
