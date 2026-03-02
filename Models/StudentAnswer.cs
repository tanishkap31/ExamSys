using System;
using System.Collections.Generic;

namespace Online_Exam_system.Models;

public partial class StudentAnswer
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int ExamId { get; set; }

    public int QuestionId { get; set; }

    public string? SelectedOption { get; set; }

    public DateTime? CreatedAt { get; set; }
}
