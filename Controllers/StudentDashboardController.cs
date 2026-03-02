using Microsoft.AspNetCore.Mvc;

namespace Online_Exam_system.Controllers
{
    public class StudentDashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
