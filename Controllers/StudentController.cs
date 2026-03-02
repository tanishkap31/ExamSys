using Microsoft.AspNetCore.Mvc;
using Online_Exam_system.Models;

namespace Online_Exam_system.Controllers
{
    public class StudentController : Controller
    {
        private readonly OnlineExamSystemContext _context;

        public StudentController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var role = HttpContext.Session.GetString("UserRole");


            var students = _context.Users
                                   .Where(u => u.Role == "Student")
                                   .ToList();

            return View(students);
        }
    }
}
