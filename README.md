# 🖥️ Online Examination System

An Online Examination System developed using ASP.NET Core MVC and SQL Server.  
The system allows administrators to create exams and questions, while students can attempt exams and view results.


# 🔐 Authentication & Authorization

## Student Registration
- Students can create an account
- System checks if email already exists
- Duplicate email validation
- Default role assigned as **Student**
- Data stored in **Users table**

## Login System
- Login using email and password
- Session-based authentication
- Role-based access control:
  - Admin
  - Student

# 👨‍💼 Admin Panel Functionalities

## Exam Management
Admin can:
- Create exams
- Set exam title and description
- Set exam date
- Set exam duration
- Activate / Deactivate exams
- Edit exam details
- View all exams

Data stored in:
**Exams table**


## Question Management
Admin can add MCQ questions including:

- Question text
- Option A
- Option B
- Option C
- Option D
- Correct answer
- Marks per question

Data stored in:
Questions table



## Result Management
Admin can view results including:

- Student Name
- Exam Title
- Obtained Marks
- Total Marks
- Percentage
- Submission Date

Data retrieved using joins from:

- Users
- Exams
- Results


# 🎓 Student Functionalities

## View Available Exams
Students can view only **active exams**.

## Attempt Exam
- Questions load based on selected exam
- Students select answers (MCQ)
- Marks calculated automatically
- Results stored in database

## View Result
Students can see:
- Obtained marks
- Total marks
- Percentage


# 🗄️ Database Structure

## Users Table
Stores:
- Name
- Email
- Password
- Role
- Created date

## Exams Table
Stores:
- Title
- Description
- Exam date
- Duration
- Status (Active / Inactive)
- Created by admin

## Questions Table
Stores:
- Exam ID
- Question text
- Options A–D
- Correct option
- Marks

## Results Table
Stores:
- Student ID
- Exam ID
- Obtained marks
- Total marks
- Submission time


# ⚙️ Technologies Used

- ASP.NET Core MVC
- C#
- SQL Server
- Entity Framework Core
- LINQ
- HTML / CSS / JavaScript


# 🎯 Key Features

- Role-based login system
- Duplicate email validation
- Exam creation & management
- MCQ question system
- Automatic result calculation
- Admin result dashboard
- Clean MVC architecture
- Relational database design


# 🚀 Resume Description

Developed a role-based Online Examination System using ASP.NET Core MVC and SQL Server. Implemented exam management, MCQ-based test system, automatic result calculation, and admin result dashboard using Entity Framework Core and LINQ.
