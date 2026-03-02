using Online_Exam_system.Models;

namespace Online_Exam_system.ViewModels
{
    public class AdminDashboardViewModel
    {
        public int TotalExams { get; set; }
        public int TotalQuestions { get; set; }
        public int ActiveExams { get; set; }
        public int TotalStudents { get; set; }

        public List<Exam>? RecentExams { get; set; }
    }
}
