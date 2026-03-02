using System;
using System.Collections.Generic;

namespace Online_Exam_system.Models;

public partial class Exam
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime ExamDate { get; set; }

    public int Duration { get; set; }

    public bool IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
}
