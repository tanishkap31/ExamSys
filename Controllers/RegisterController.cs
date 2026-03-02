using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_Exam_system.Models;
using Online_Exam_system.ViewModels;

namespace Online_Exam_system.Controllers
{
    public class RegisterController : Controller
    {

        private readonly OnlineExamSystemContext _context;

        public RegisterController(OnlineExamSystemContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            if (model.Password != model.ConfirmPassword)
            {
                TempData["Error"] = "Passwords do not match!";
                return RedirectToAction("Index"); // your login/register page
            }

            // Check if email already exists
            var existingUser = _context.Users
                .FirstOrDefault(u => u.Email == model.Email);

            if (existingUser != null)
            {
                TempData["Error"] = "Email is already registered!";
                return RedirectToAction("Index");
            }

            // Create new user
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                Password = model.Password, // ⚠ Later we will hash this
                Role = "student",
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            TempData["Success"] = "Registration successful! Please login.";

            return RedirectToAction("Index" , "Login");
        }
    }
}
