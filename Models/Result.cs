using System;
using System.Collections.Generic;

namespace Online_Exam_system.Models;

public partial class Result
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int ExamId { get; set; }

    public int TotalMarks { get; set; }

    public int ObtainedMarks { get; set; }

    public decimal? Percentage { get; set; }

    public DateTime SubmittedAt { get; set; }
}
