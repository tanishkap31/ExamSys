using Microsoft.AspNetCore.Mvc;
using Online_Exam_system.Models;
using Online_Exam_system.ViewModels;

namespace Online_Exam_system.Controllers
{
    public class ResultController : Controller
    {
        private readonly OnlineExamSystemContext _context;

        public ResultController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var role = HttpContext.Session.GetString("UserRole");

            if (role != "admin")
                return RedirectToAction("Index", "Login");

            var results = _context.Results
                .Join(_context.Users,
                    r => r.StudentId,
                    u => u.Id,
                    (r, u) => new { r, u })
                .Join(_context.Exams,
                    ru => ru.r.ExamId,
                    e => e.Id,
                    (ru, e) => new AdminResultViewModel
                    {
                        StudentName = ru.u.Name,
                        ExamTitle = e.Title,
                        ObtainedMarks = ru.r.ObtainedMarks,
                        TotalMarks = ru.r.TotalMarks,
                        Percentage = ru.r.TotalMarks > 0
                            ? (double)ru.r.ObtainedMarks * 100 / ru.r.TotalMarks
                            : 0,
                        SubmittedAt = ru.r.SubmittedAt
                    })
                .OrderByDescending(x => x.SubmittedAt)
                .ToList();

            return View(results);
        }
    }
}
