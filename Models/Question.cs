using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Online_Exam_system.Models;

public partial class Question
{
    [Key]
    public int Id { get; set; }

    public int ExamId { get; set; }

    public string QuestionText { get; set; } = null!;

    public string OptionA { get; set; } = null!;

    public string OptionB { get; set; } = null!;

    public string OptionC { get; set; } = null!;

    public string OptionD { get; set; } = null!;

    public string CorrectOption { get; set; } = null!;

    public int Marks { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Exam? Exam { get; set; } 
}
