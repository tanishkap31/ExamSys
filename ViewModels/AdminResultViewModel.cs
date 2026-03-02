namespace Online_Exam_system.ViewModels
{
    public class AdminResultViewModel
    {
        public string StudentName { get; set; }
        public string ExamTitle { get; set; }
        public int ObtainedMarks { get; set; }
        public int TotalMarks { get; set; }
        public double Percentage { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
