# HabitFlow - Full-Stack Personal Habit Tracker

HabitFlow is a modern, production-ready, full-stack Personal Habit Tracker designed to help users build and maintain routines. The application features a clean, responsive SaaS-style dashboard, a secure JWT authentication system, interactive month-view calendars, weekly/monthly completion analytics charts, and automatic streak calculations.

---

## 1. Technology Stack

### Frontend
* **React** (v19) & **Vite**
* **Tailwind CSS** (for responsive, premium styles)
* **Axios** (with JWT interceptors)
* **Recharts** (interactive data visualizations)
* **Lucide React Icons**

### Backend
* **Java 17** & **Spring Boot** (v3.1.5)
* **Spring Security** & **JWT Authentication**
* **Spring Data JPA** & **Hibernate** (MySQL)
* **Bean Validation** (Jakarta Validation)
* **Maven** (dependency management)

### Database
* **MySQL** (Relational schema storage)

---

## 2. Application Architecture

```
React (Vite)  ──[ Axios (with JWT) ]──>  REST API (Spring Boot)
   │                                           │
   ▼                                           ▼
Components                                 Controllers (Auth, Habits, Dashboard, Analytics)
   │                                           │
   ▼                                           ▼
Page Layouts                               Services (Streak count, aggregators)
                                               │
                                               ▼
                                           Repositories (JPA / Hibernate)
                                               │
                                               ▼
                                           MySQL Database
```

---

## 3. Database Design

The database name is `habit_tracker`. It consists of 3 relational tables:

### `users`
* `id` (BIGINT, PK, Auto-increment)
* `full_name` (VARCHAR, Non-nullable)
* `email` (VARCHAR, Unique, Non-nullable)
* `password` (VARCHAR, BCrypt hashed, Non-nullable)
* `created_at` (DATETIME)
* `updated_at` (DATETIME)

### `habits`
* `id` (BIGINT, PK, Auto-increment)
* `user_id` (BIGINT, FK referencing `users.id`, Non-nullable)
* `name` (VARCHAR, Non-nullable)
* `description` (TEXT)
* `category` (VARCHAR, Study/Health/Fitness/Personal/Work/Learning/Other)
* `frequency` (VARCHAR, Daily/Weekly/Custom)
* `target_count` (INT, default 1)
* `color` (VARCHAR, theme class)
* `icon` (VARCHAR, Lucide identifier)
* `active` (BOOLEAN, default true for soft-archiving support)
* `created_at` (DATETIME)
* `updated_at` (DATETIME)

### `habit_completions`
* `id` (BIGINT, PK, Auto-increment)
* `habit_id` (BIGINT, FK referencing `habits.id`, Non-nullable)
* `completion_date` (DATE, user local calendar date)
* `completed` (BOOLEAN, default true)
* `created_at` (DATETIME)
* *Unique Constraint*: `(habit_id, completion_date)` prevents duplicate completions per habit on the same day.

---

## 4. REST API Endpoints

### Authentication
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Validate credentials and receive JWT.
* `GET /api/auth/me` - Fetch authenticated user details.

### Habits
* `GET /api/habits` - Retrieve active habits (use `includeArchived=true` for all).
* `POST /api/habits` - Create a new habit.
* `GET /api/habits/{id}` - Fetch single habit details.
* `PUT /api/habits/{id}` - Edit an existing habit.
* `DELETE /api/habits/{id}` - Permanently delete a habit.
* `PATCH /api/habits/{id}/archive` - Soft archive (`archive=true`) or restore a habit.

### Completions & Streaks
* `POST /api/habits/{id}/complete` - Check off habit for a date.
* `DELETE /api/habits/{id}/complete` - Undo completion check-off.
* `GET /api/habits/{id}/completions` - List of completed dates.
* `GET /api/completions` - Get list of completed habit IDs for a date.
* `GET /api/completions/range` - Map calendar days to completed habit lists within range.

### Dashboard & Analytics
* `GET /api/dashboard` - Get overall daily progress, streaks, and last 7 days overview.
* `GET /api/analytics` - Get ranking lists, best performing habit cards, and month charts.
* `GET /api/profile` - Fetch/update account details.
* `DELETE /api/habits/archived` - Purge all archived habits.

---

## 5. Getting Started & Running

### Prerequisites
* Java 17+
* Node.js 18+
* MySQL 8.0+

### Database Setup
Create the MySQL database named `habit_tracker` using your SQL terminal:
```sql
CREATE DATABASE IF NOT EXISTS habit_tracker;
```

### Environment Configuration
1. **Backend**: Check/configure credentials in `backend/.env`:
   ```properties
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=habit_tracker
   DB_USERNAME=root
   DB_PASSWORD=rootroot
   JWT_SECRET=your_secret_key_at_least_32_chars
   ```
2. **Frontend**: The React application is configured to hit `http://localhost:8080/api` by default. Change this if needed in `frontend/.env`:
   ```properties
   VITE_API_URL=http://localhost:8080/api
   ```

### Running Backend
Compile and run the Spring Boot project using Maven:
```bash
cd backend
mvn spring-boot:run
```
The backend server starts on `http://localhost:8080`.

### Running Frontend
Install node dependencies and launch Vite:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. Future-Ready Expansion Features
* **Gamification Layer**: Add XP values to habits, unlocking custom profile levels or milestone badges.
* **Email Reminders**: Schedule cron-jobs sending summary emails on low streak habits.
* **Social Sharing**: Share perfect completion days or streak milestones to public groups.
