using Microsoft.AspNetCore.Mvc;
using Online_Exam_system.Models;

namespace Online_Exam_system.Controllers
{

    public class AvailableExamsController : Controller
    {

        private readonly OnlineExamSystemContext _context;

        public AvailableExamsController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
