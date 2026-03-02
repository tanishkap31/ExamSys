using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_Exam_system.Models;
using Online_Exam_system.ViewModels;
using System.Diagnostics;

namespace Online_Exam_system.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly OnlineExamSystemContext _context;
        public HomeController(ILogger<HomeController> logger, OnlineExamSystemContext context)
        {
            _logger = logger;
            _context = context;
        }

        //public IActionResult Index()
        //{
        //    return View();
        //}

        public IActionResult Index()
        {
            var role = HttpContext.Session.GetString("UserRole");

            if (role == "admin")
            {
                return RedirectToAction("Index", "AdminDashboard");
                //return View("AdminDashboard");
            }
            else if (role == "student")
            {

                var studentName = HttpContext.Session.GetString("UserName");

                if (string.IsNullOrEmpty(studentName))
                    return RedirectToAction("Index", "Login");

                // Get student
                var student = _context.Users
                    .FirstOrDefault(u => u.Name == studentName);

                if (student == null)
                    return RedirectToAction("Index", "Login");


                // =============================
                // BASIC COUNTS
                // =============================

                int totalExams = _context.Exams.Count();

                int attemptedExams = _context.Results
                    .Count(r => r.StudentId == student.Id);

                int pendingExams = totalExams - attemptedExams;


                // =============================
                // GET STUDENT RESULTS (FETCH FIRST)
                // =============================

                var studentResults = _context.Results
                    .Where(r => r.StudentId == student.Id)
                    .ToList();


                // =============================
                // CALCULATE AVERAGE (IN MEMORY)
                // =============================

                double averageScore = 0;

                if (studentResults.Count > 0)
                {
                    averageScore = studentResults
                        .Where(r => r.TotalMarks > 0)
                        .Average(r => (double)r.ObtainedMarks * 100 / r.TotalMarks);
                }


                // =============================
                // RECENT EXAMS
                // =============================

                var recentExams = studentResults
                    .OrderByDescending(r => r.SubmittedAt)
                    .Take(5)
                    .Join(_context.Exams,
                        r => r.ExamId,
                        e => e.Id,
                        (r, e) => new RecentExamViewModel
                        {
                            ExamName = e.Title,
                            Percentage = r.TotalMarks > 0
                                ? (double)r.ObtainedMarks * 100 / r.TotalMarks
                                : 0
                        })
                    .ToList();


                // =============================
                // UPCOMING EXAMS
                // =============================

                var upcomingExams = _context.Exams
                    .Where(e => e.ExamDate > DateTime.Now)
                    .Select(e => new UpcomingExamViewModel
                    {
                        ExamName = e.Title,
                        ExamDate = e.ExamDate
                    })
                    .ToList();


                // =============================
                // FINAL MODEL
                // =============================

                var model = new StudentDashboardViewModel
                {
                    TotalExams = totalExams,
                    AttemptedExams = attemptedExams,
                    PendingExams = pendingExams,
                    AverageScore = averageScore,
                    RecentExams = recentExams,
                    UpcomingExams = upcomingExams
                };

                return View("Index", model);
                //return View("index");

            }

            return RedirectToAction("Index", "Login");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
