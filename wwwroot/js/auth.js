//const API_URL = "http://localhost:5151/api";
let currentRole = 'student'; // Default role

document.addEventListener('DOMContentLoaded', function() {
  // Initialize role as student
  switchRole('student');
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    setupPasswordStrength();
    setupPasswordToggle('regPassword');
  }

  // Login page password toggle
  const loginPassword = document.getElementById('password');
  if (loginPassword) {
    setupPasswordToggle('password');
  }
});

function switchRole(role) {
  currentRole = role;
  
  // Update active tab
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.role === role);
  });
  
  // Update login page content
  if (document.getElementById('loginTitle')) {
    const titles = {
      student: { 
        title: 'Welcome Back!', 
        subtitle: 'Sign in to your student account',
        btnText: 'Sign In as Student'
      },
      admin: { 
        title: 'Admin Login', 
        subtitle: 'Access admin dashboard',
        btnText: 'Sign In as Admin'
      }
    };
    const data = titles[role];
    document.getElementById('loginTitle').textContent = data.title;
    document.getElementById('loginSubtitle').textContent = data.subtitle;
    document.getElementById('loginBtnText').textContent = data.btnText;
  }
  
  // Update register page content
  if (document.getElementById('registerTitle')) {
    const titles = {
      student: { 
        title: 'Create Student Account', 
        subtitle: 'Join as a student',
        btnText: 'Create Student Account',
        hint: 'Choose your account type'
      },
      admin: { 
        title: 'Create Admin Account', 
        subtitle: 'Admin registration (requires approval)',
        btnText: 'Create Admin Account',
        hint: 'Admin accounts require approval'
      }
    };
    const data = titles[role];
    document.getElementById('registerTitle').textContent = data.title;
    document.getElementById('registerSubtitle').textContent = data.subtitle;
    document.getElementById('registerBtnText').textContent = data.btnText;
    document.getElementById('roleHint').textContent = data.hint;
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!email || !password) {
    showMessage(msg, "Please fill all fields", "error");
    return;
  }

  showMessage(msg, "Signing in...", "success");

  loginUser(email, password, currentRole)
    .then(() => {
      // Success handled in loginUser
    })
    .catch(error => {
      showMessage(msg, error.message || "Login failed", "error");
    });
}

function handleRegister(e) {
  e.preventDefault();
  
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;
  const msg = document.getElementById("regMsg");

  // Validation
  if (!firstName || !lastName || !email || !password) {
    showMessage(msg, "Please fill all fields", "error");
    return;
  }

  if (password.length < 8) {
    showMessage(msg, "Password must be at least 8 characters", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(msg, "Passwords do not match", "error");
    return;
  }

  if (!terms) {
    showMessage(msg, "Please accept terms & conditions", "error");
    return;
  }

  showMessage(msg, "Creating account...", "success");

  registerUser({
    firstName,
    lastName,
    email,
    password,
    role: currentRole
  }).then(() => {
    const roleText = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    showMessage(msg, `${roleText} account created! Please login.`, "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }).catch(error => {
    showMessage(msg, error.message || "Registration failed", "error");
  });
}

//async function loginUser(email, password, role) {
//  const loginData = { email, password, role };
  
//  const response = await fetch(`${API_URL}/Auth/login`, {
//    method: "POST",
//    headers: { "Content-Type": "application/json" },
//    body: JSON.stringify(loginData)
//  });

//  const data = await response.json();

//  if (!response.ok || !data.token) {
//    throw new Error(data.message || "Invalid credentials");
//  }

//  localStorage.setItem("token", data.token);
//  localStorage.setItem("role", role);

//  // Verify profile and redirect
//  try {
//    const profileResponse = await fetch(`${API_URL}/Auth/profile`, {
//      headers: { "Authorization": "Bearer " + data.token }
//    });

//    const profile = await profileResponse.json();

//    if (profile.role === "Admin" || role === "admin") {
//      window.location.href = "./admin-dashboard.html";
//    } else {
//      window.location.href = "./student-dashboard.html";
//    }
//  } catch (error) {
//    throw new Error("Profile verification failed");
//  }
//}

//async function registerUser(userData) {
//  const response = await fetch(`${API_URL}/Auth/register`, {
//    method: "POST",
//    headers: { "Content-Type": "application/json" },
//    body: JSON.stringify(userData)
//  });

//  const data = await response.json();

//  if (!response.ok) {
//    throw new Error(data.message || "Registration failed");
//  }

//  return data;
//}

function togglePassword() {
  const passwordField = event.target.closest('.input-group').querySelector('input');
  const toggleIcon = document.getElementById("toggleIcon");
  
  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function setupPasswordToggle(passwordId) {
  const toggle = document.querySelector('.password-toggle');
  if (toggle) {
    toggle.onclick = () => {
      const password = document.getElementById(passwordId);
      const icon = document.getElementById("toggleIcon");
      if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        password.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    };
  }
}

function setupPasswordStrength() {
  const password = document.getElementById("regPassword");
  const strengthBar = document.querySelector(".strength-bar");
  
  if (!password || !strengthBar) return;
  
  password.addEventListener("input", function() {
    const strength = calculatePasswordStrength(this.value);
    let bar = strengthBar.querySelector("div");
    if (!bar) {
      bar = document.createElement("div");
      strengthBar.appendChild(bar);
    }
    
    bar.style.width = strength.width;
    bar.style.background = strength.color;
  });
}

function calculatePasswordStrength(password) {
  let score = 0;
  if (password.length > 7) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengths = [
    { width: "25%", color: "#dc3545" }, // Weak
    { width: "50%", color: "#ffc107" }, // Medium
    { width: "75%", color: "#fd7e14" }, // Good
    { width: "100%", color: "#28a745" } // Strong
  ];

  return strengths[Math.min(score, 3)];
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = `message ${type}`;
}

function loginWithGoogle() {
  alert("Google OAuth integration coming soon!");
}

// Expose global functions for onclick attributes
window.switchRole = switchRole;
window.togglePassword = togglePassword;
