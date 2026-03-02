const API_URL = "http://localhost:5151/api";
const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const attemptId = params.get("attemptId");

if (!token || !attemptId) {
  window.location.href = "../login.html";
}

let examData = null;
let currentQuestionIndex = 0;
let answers = {};
let timeLeft = 0;
let timerInterval = null;
let stream = null;
let isProctoringActive = false;

// Initialize proctoring
document.addEventListener('DOMContentLoaded', initProctoring);

async function initProctoring() {
  try {
    // Check camera and microphone
    await checkMediaDevices();
    
    // ✅ FIXED: Correct backend endpoint
    const response = await fetch(`${API_URL}/ExamAttempts/${attemptId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    examData = await response.json();
    timeLeft = examData.duration * 60; // Convert to seconds
    
    if (allDevicesReady()) {
      document.getElementById('startExamBtn').disabled = false;
    }
  } catch (error) {
    console.error('Exam init error:', error);
    showProctorMessage('Failed to load exam data', 'error');
  }
}

async function checkMediaDevices() {
  try {
    // Request camera and microphone
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: true
    });

    const video = document.getElementById('proctorVideo');
    video.srcObject = stream;

    // Update status
    document.getElementById('cameraStatus').textContent = 'Camera Ready ✓';
    document.getElementById('micStatus').textContent = 'Microphone Ready ✓';
    document.getElementById('cameraIcon').className = 'fas fa-video status-icon status-ready';
    document.getElementById('micIcon').className = 'fas fa-microphone status-icon status-ready';
    
  } catch (err) {
    console.error('Media error:', err);
    document.getElementById('cameraStatus').textContent = 'Camera Access Denied';
    document.getElementById('micStatus').textContent = 'Microphone Access Denied';
    document.getElementById('cameraIcon').className = 'fas fa-video status-icon status-error';
    document.getElementById('micIcon').className = 'fas fa-microphone status-icon status-error';
  }
}

function allDevicesReady() {
  return document.getElementById('cameraStatus').textContent.includes('Ready') &&
         document.getElementById('micStatus').textContent.includes('Ready');
}

document.getElementById('startExamBtn').onclick = startExam;

function startExam() {
  if (!allDevicesReady()) {
    showProctorMessage('Please enable camera and microphone first', 'error');
    return;
  }

  // Hide proctoring, show exam
  document.getElementById('proctoringScreen').style.display = 'none';
  document.getElementById('examApp').style.display = 'block';

  // Initialize exam
  initExam();
  startTimer();
  startProctoring();
  renderCurrentQuestion();
  renderQuestionPalette();
}

function initExam() {
  document.getElementById('examTitle').textContent = examData.title;
  document.getElementById('qCount').textContent = `${examData.questions.length} Questions`;
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      submitExam();
    }
    
    // Warning at 5 minutes left
    if (timeLeft === 300) {
      alert('5 minutes remaining!');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Color change warning
  const timerEl = document.getElementById('timer');
  if (timeLeft <= 300) {
    timerEl.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
  }
}

function startProctoring() {
  isProctoringActive = true;
  // Continuous proctoring check
  setInterval(async () => {
    if (isProctoringActive && stream) {
      // Log proctoring activity (optional)
      console.log('Proctoring active...');
    }
  }, 10000);
}

// ✅ FIXED: Matches backend response (optionA, optionB, optionC, optionD)
function renderCurrentQuestion() {
  const question = examData.questions[currentQuestionIndex];
  const container = document.getElementById('questions');
  
  container.innerHTML = `
    <div class="question-card">
      <h4>Q${currentQuestionIndex + 1}: ${question.text}</h4>
      
      <label class="option ${answers[question.id] === 'A' ? 'selected' : ''}">
        <input type="radio" name="q_${question.id}" value="A" 
               ${answers[question.id] === 'A' ? 'checked' : ''}>
        <span class="option-text">A. ${question.optionA}</span>
      </label>
      
      <label class="option ${answers[question.id] === 'B' ? 'selected' : ''}">
        <input type="radio" name="q_${question.id}" value="B" 
               ${answers[question.id] === 'B' ? 'checked' : ''}>
        <span class="option-text">B. ${question.optionB}</span>
      </label>
      
      <label class="option ${answers[question.id] === 'C' ? 'selected' : ''}">
        <input type="radio" name="q_${question.id}" value="C" 
               ${answers[question.id] === 'C' ? 'checked' : ''}>
        <span class="option-text">C. ${question.optionC}</span>
      </label>
      
      <label class="option ${answers[question.id] === 'D' ? 'selected' : ''}">
        <input type="radio" name="q_${question.id}" value="D" 
               ${answers[question.id] === 'D' ? 'checked' : ''}>
        <span class="option-text">D. ${question.optionD}</span>
      </label>
    </div>
  `;

  // Update navigation
  document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
  document.getElementById('progress').textContent = 
    `Question ${currentQuestionIndex + 1} of ${examData.questions.length}`;
}

// ✅ FIXED: Proper question tracking
function renderQuestionPalette() {
  const container = document.getElementById('paletteQuestions');
  container.innerHTML = examData.questions.map((q, index) => {
    const answered = answers.hasOwnProperty(q.id) && answers[q.id];
    const className = answered ? 'answered' : 'not-answered';
    return `<div class="palette-question ${className}" onclick="goToQuestion(${index})">${index + 1}</div>`;
  }).join('');
}

function goToQuestion(index) {
  currentQuestionIndex = index;
  renderCurrentQuestion();
  hideQuestionPalette();
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < examData.questions.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  }
}

function showQuestionPalette() {
  document.getElementById('questionPalette').classList.add('show');
}

function hideQuestionPalette() {
  document.getElementById('questionPalette').classList.remove('show');
}

// ✅ FIXED: Save answers correctly
document.addEventListener('change', (e) => {
  if (e.target.matches('input[type="radio"]')) {
    const questionId = parseInt(e.target.name.split('_')[1]);
    answers[questionId] = e.target.value;
    renderQuestionPalette();
    renderCurrentQuestion(); // Refresh to show selected state
  }
});

async function submitExam() {
  if (timerInterval) clearInterval(timerInterval);
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  // Show confirmation
  if (!confirm('Are you sure you want to submit the exam?')) {
    return;
  }

  const submitData = {
    attemptId: parseInt(attemptId),
    answers: Object.entries(answers).map(([qId, option]) => ({
      questionId: parseInt(qId),
      selectedOption: option
    }))
  };

  try {
    const response = await fetch(`${API_URL}/Results/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(submitData)
    });

    if (!response.ok) {
      throw new Error(`Submit failed: ${response.status}`);
    }

    const result = await response.json();
    alert(`🎉 Exam Submitted Successfully!\n\nScore: ${result.score}/${examData.totalMarks}\nPercentage: ${result.percentage}%`);
    window.location.href = "../student-dashboard.html";
  } catch (error) {
    console.error('Submit error:', error);
    document.getElementById('msg').textContent = 'Submission failed. Please try again.';
    document.getElementById('msg').style.color = '#e74c3c';
  }
}

function showProctorMessage(message, type = 'info') {
  const msgEl = document.getElementById('proctorMsg');
  msgEl.textContent = message;
  msgEl.className = `proctor-message ${type}`;
  msgEl.style.display = 'block';
  setTimeout(() => {
    msgEl.style.display = 'none';
  }, 5000);
}

// 🔒 ANTI-CHEAT PROTECTION
document.addEventListener('keydown', (e) => {
  // Block Inspect Element, Ctrl+Shift+I, F12, etc.
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
      (e.ctrlKey && e.shiftKey && e.key === 'C')) {
    e.preventDefault();
    return false;
  }
});

// Block right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Block tab switching detection
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isProctoringActive) {
    console.warn('Tab switch detected');
    // Could send violation to server
  }
});

// Prevent leaving page
window.onbeforeunload = () => {
  return 'Exam in progress. Are you sure you want to leave? This will end your exam.';
};

// Fullscreen enforcement (optional)
function requestFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}
