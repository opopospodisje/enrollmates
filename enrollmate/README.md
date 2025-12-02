# ENROLLMATE: A Digital Enrollment Solution for Polong National High School

ENROLLMATE is a web-based enrollment management system designed to simplify school administration, manage students, teachers, subjects, sections, and track grades and enrollment records.

---

## Features

### Admin
- Dashboard with key metrics: total students, applicants, teachers, sections, class groups.
- Manage **Applicants**: add, update, approve, or delete.
- Manage **Students**: add, update, promote, transfer, or delete.
- Manage **Teachers**: create accounts, assign roles, view info.
- Manage **Sections & Grade Levels**.
- Manage **School Years**: set active school year.
- Manage **Class Groups & Subjects**.
- Track **Enrollments** and **Grades**.

### Teacher
- Dashboard: total students, classes, assigned subjects.
- View assigned subjects.
- Manage grades for students.

### Student
- Access student homepage.
- View personal grades.

---

## Tech Stack
- **Backend:** Laravel 10
- **Frontend:** React (with Inertia.js & TypeScript)
- **Database:** MySQL
- **Authentication & Roles:** Laravel Breeze, Spatie Permissions
- **Other Libraries:** Inertia.js, Tailwind CSS

---
## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/jaysuniga/enrollmate.git
cd enrollmate

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy .env file and set database credentials
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Build frontend assets
npm run dev

# Start the local server
php artisan serve
```
Access the app at http://localhost:8000.

---

## Initial Accounts

After seeding the database, the following accounts are available for login:

### Admin
- Email: admin@enrollmate.com
- Password: password

### Teachers
- Jane Smith – jane.smith@example.com / password
- John Smith – john.smith@example.com / password
- Alice Johnson – alice.johnson@example.com / password
- Bob Brown – bob.brown@example.com / password

### Students
- John Doe – john.doe@example.com / password

---

## Recommended Setup Flow

If creating data manually, follow this order to avoid issues:

```text
1. School Year
   - Create the active school year first.

2. Grade Levels
   - Add all grade levels (e.g., Grade 7–10).

3. Sections
   - Create sections under each grade level.
   - Mark special sections if needed.

4. Teachers
   - Create teacher accounts (users + teacher profiles).

5. Subjects
   - Create subjects (regular vs special per grade).

6. Class Groups
   - Assign sections to class groups and link them to the active school year.

7. Class Group Subjects
   - Assign subjects to class groups and link them to teachers.

8. Applicants / Students
   - Create applicants first, then enroll them as students in class groups.

9. Enrollments
   - Link students to their respective class groups for the current school year.
```
