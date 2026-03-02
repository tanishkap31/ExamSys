using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_Exam_system.Models;

namespace Online_Exam_system.Controllers
{
   
    public class ExamController : Controller
    {
        private readonly OnlineExamSystemContext _context;

        public ExamController(OnlineExamSystemContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var exams = _context.Exams.ToList();
            return View(exams);
        }

        // 🔹 Create Exam GET
        public IActionResult Create()
        {
            return View();
        }

        // 🔹 Create Exam POST
        [HttpPost]
        public IActionResult Create(Exam exam)
        {
            if (ModelState.IsValid)
            {
                exam.CreatedAt = DateTime.Now;
                exam.CreatedBy = 1; // later take from session
                exam.IsActive = true;

                _context.Exams.Add(exam);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(exam);
        }


        // GET: Edit Exam
        public IActionResult Edit(int id)
        {
            var exam = _context.Exams.FirstOrDefault(e => e.Id == id);

            if (exam == null)
                return RedirectToAction("Index");

            return View(exam);
        }

        [HttpPost]
        public IActionResult Edit(Exam model)
        {
            var exam = _context.Exams.FirstOrDefault(e => e.Id == model.Id);

            if (exam == null)
                return RedirectToAction("Index");

            exam.Title = model.Title;
            exam.Description = model.Description;
            exam.ExamDate = model.ExamDate;
            exam.Duration = model.Duration;
            exam.IsActive = model.IsActive;

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // 🔹 Add Question GET
        public IActionResult AddQuestion(int examId)
        {
            ViewBag.ExamId = examId;
            return View();
        }

        // 🔹 Add Question POST
        [HttpPost]
        public IActionResult AddQuestion(Question question)
        {
            if (ModelState.IsValid)
            {
                question.CreatedAt = DateTime.Now;

                _context.Questions.Add(question);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(question);
        }
        public IActionResult ViewQuestions(int examId)
        {
            var questions = _context.Questions
                                    .Where(q => q.ExamId == examId)
                                    .ToList();

            ViewBag.ExamId = examId;

            return View(questions);
        }

        public IActionResult EditQuestion(int id)
        {
            var question = _context.Questions.Find(id);

            if (question == null)
                return NotFound();

            return View(question);
        }

        [HttpPost]
        public IActionResult EditQuestion(Question question)
        {
            if (ModelState.IsValid)
            {
                _context.Questions.Update(question);
                _context.SaveChanges();

                return RedirectToAction("ViewQuestions",
                       new { examId = question.ExamId });
            }

            return View(question);
        }


        //public IActionResult AvailableExams()
        //{
        //    var role = HttpContext.Session.GetString("UserRole");


        //    var exams = _context.Exams
        //                        .Where(e => e.IsActive == true
        //                                 && e.ExamDate <= DateTime.Now)
        //                        .ToList();

        //    return View(exams);
        //}
        public IActionResult AvailableExams()
        {
            var studentName = HttpContext.Session.GetString("UserName");

            var student = _context.Users
                .FirstOrDefault(u => u.Name == studentName);

            var exams = _context.Exams
                .Where(e => e.IsActive == true && e.ExamDate <= DateTime.Now)
                .ToList();

            // Get attempted exam IDs
            var attemptedExamIds = _context.Results
                .Where(r => r.StudentId == student.Id)
                .Select(r => r.ExamId)
                .ToList();

            ViewBag.AttemptedExamIds = attemptedExamIds;

            return View(exams);
        }

        //public IActionResult AttemptExam(int examId)
        //{
        //    var studentId = HttpContext.Session.GetInt32("UserId");


        //    var questions = _context.Questions
        //                            .Where(q => q.ExamId == examId)
        //                            .ToList();

        //    ViewBag.ExamId = examId;

        //    return View(questions);
        //}

        public IActionResult AttemptExam(int examId)
        {
            var studentId = HttpContext.Session.GetInt32("UserId");

            if (studentId == null)
                return RedirectToAction("Index", "Login");

            // Get exam
            var exam = _context.Exams
                .FirstOrDefault(e => e.Id == examId);

            // Get questions
            var questions = _context.Questions
                                    .Where(q => q.ExamId == examId)
                                    .ToList();

            ViewBag.ExamId = examId;
            ViewBag.Duration = exam.Duration; // duration in minutes

            return View(questions);
        }

        [HttpPost]
        public IActionResult SubmitExam(int examId,
    Dictionary<int, string> answers)
        {
            var studentId = HttpContext.Session.GetInt32("UserId");

            if (studentId == null)
                return RedirectToAction("Index", "Login");

            var questions = _context.Questions
                                    .Where(q => q.ExamId == examId)
                                    .ToList();

            int totalMarks = questions.Sum(q => q.Marks);
            int obtainedMarks = 0;

            foreach (var q in questions)
            {
                if (answers.ContainsKey(q.Id)
                    && answers[q.Id] == q.CorrectOption)
                {
                    obtainedMarks += q.Marks;
                }
            }

            decimal percentage = ((decimal)obtainedMarks / totalMarks) * 100;

            Result result = new Result
            {
                StudentId = studentId.Value,
                ExamId = examId,
                TotalMarks = totalMarks,
                ObtainedMarks = obtainedMarks,
                Percentage = percentage,
                SubmittedAt = DateTime.Now
            };

            _context.Results.Add(result);
            _context.SaveChanges();

            return RedirectToAction("ExamResult",
                    new { id = result.Id });
        }

        public IActionResult ExamResult(int id)
        {
            var result = _context.Results
                                 .FirstOrDefault(r => r.Id == id);

            return View(result);
        }

    }
}
