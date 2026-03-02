namespace Online_Exam_system.ViewModels
{
    public class StudentDashboardViewModel
    {
        public int TotalExams { get; set; }
        public int AttemptedExams { get; set; }
        public int PendingExams { get; set; }
        public double AverageScore { get; set; }

        public List<RecentExamViewModel> RecentExams { get; set; }
        public List<UpcomingExamViewModel> UpcomingExams { get; set; }
    }

    public class RecentExamViewModel
    {
        public string ExamName { get; set; }
        public DateTime Date { get; set; }
        public double Percentage { get; set; }
    }

    public class UpcomingExamViewModel
    {
        public string ExamName { get; set; }
        public DateTime ExamDate { get; set; }
    }
}

