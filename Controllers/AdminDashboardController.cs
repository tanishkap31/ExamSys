using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_Exam_system.Models;
using Online_Exam_system.ViewModels;

namespace Online_Exam_system.Controllers
{
    public class AdminDashboardController : Controller
    {
        private readonly OnlineExamSystemContext _context;

        public AdminDashboardController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var role = HttpContext.Session.GetString("UserRole");

            if (string.IsNullOrEmpty(role))
                return RedirectToAction("Index", "Login");

            if (role == "admin")
            {
                var model = new AdminDashboardViewModel
                {
                    TotalExams = _context.Exams.Count(),
                    TotalQuestions = _context.Questions.Count(),
                    ActiveExams = _context.Exams.Count(e => e.IsActive),
                    TotalStudents = _context.Users.Count(u => u.Role == "Student"),

                    RecentExams = _context.Exams
                                          .OrderByDescending(e => e.CreatedAt)
                                          .Take(5)
                                          .ToList()
                };

                return View("index", model);
            }

            return View("StudentDashboard");
        }
    }
}
