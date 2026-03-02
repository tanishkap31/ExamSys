using Microsoft.AspNetCore.Mvc;
using Online_Exam_system.Models;
using Online_Exam_system.ViewModels;

namespace Online_Exam_system.Controllers
{
    public class MyResultsController : Controller
    {
        private readonly OnlineExamSystemContext _context;

        public MyResultsController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult MyResults()
        {
            var studentName = HttpContext.Session.GetString("UserName");

            if (studentName == null)
                return RedirectToAction("Index", "Login");

            var student = _context.Users
                .FirstOrDefault(u => u.Name == studentName);

            var results = _context.Results
                .Where(r => r.StudentId == student.Id)
                .Join(_context.Exams,
                      r => r.ExamId,
                      e => e.Id,
                      (r, e) => new ResultViewModel
                      {
                          ExamTitle = e.Title,
                          ObtainedMarks = r.ObtainedMarks,
                          TotalMarks = r.TotalMarks,
                          Percentage = (double)r.ObtainedMarks / r.TotalMarks * 100,
                          //ExamDate = r.SubmittedAt
                      })
                .ToList();

            return View(results);
        }
    }
}
