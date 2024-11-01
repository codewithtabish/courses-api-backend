/** @format */

import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  foreignKey,
} from 'drizzle-orm/pg-core';

// Users table
export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(), // Clerk user ID
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isAdmin: boolean('is_admin').default(false),
});

// Courses table
export const Courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  published: boolean('published').default(false),
});

// Lessons table (each course can have multiple lessons)
export const Lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  videoUrl: varchar('video_url', { length: 500 }).notNull(),
  content: text('content').notNull(),
  additionalResources: text('additional_resources'),
  order: integer('order').notNull(),
});

// Lesson Quizzes table
export const LessonQuizzes = pgTable('lesson_quizzes', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .notNull()
    .references(() => Lessons.id, { onDelete: 'cascade' }),
  passingScore: integer('passing_score').default(70).notNull(),
  questionCount: integer('question_count').default(7).notNull(),
});

// Lesson Quiz Questions table
export const LessonQuizQuestions = pgTable('lesson_quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => LessonQuizzes.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  order: integer('order').notNull(),
});

// Lesson Quiz Answers table (stores both correct answers and user answers)
export const LessonQuizAnswers = pgTable('lesson_quiz_answers', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id')
    .notNull()
    .references(() => LessonQuizQuestions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => Users.id, {
    onDelete: 'cascade',
  }),
  answerText: text('answer_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
});

// Final Exam table
export const FinalExams = pgTable('final_exams', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  passingScore: integer('passing_score').default(70).notNull(),
  questionCount: integer('question_count').default(20).notNull(),
});

// Final Exam Questions table
export const FinalExamQuestions = pgTable('final_exam_questions', {
  id: serial('id').primaryKey(),
  examId: integer('exam_id')
    .notNull()
    .references(() => FinalExams.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  order: integer('order').notNull(),
});

// Final Exam Answers table
export const FinalExamAnswers = pgTable('final_exam_answers', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id')
    .notNull()
    .references(() => FinalExamQuestions.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => Users.id, {
    onDelete: 'cascade',
  }),
  answerText: text('answer_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
});

// Final Exam Attempts table
export const FinalExamAttempts = pgTable('final_exam_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  attemptDate: timestamp('attempt_date').defaultNow().notNull(),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  attemptNumber: integer('attempt_number').notNull(), // Tracks attempt count
});

// Interview table (for users eligible for interviews before certification)
export const Interviews = pgTable('interviews', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  interviewDate: timestamp('interview_date').defaultNow(),
  status: varchar('status', { length: 50 }).default('pending'), // e.g., pending, passed, failed
  feedback: text('feedback'), // Any interview notes or feedback
});

// Purchases table
export const Purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  purchaseDate: timestamp('purchase_date').defaultNow().notNull(),
  accessGranted: boolean('access_granted').default(true),
});

// Certificates table (generated upon passing the final exam or interview)
export const Certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id')
    .notNull()
    .references(() => Courses.id, { onDelete: 'cascade' }),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  certificateUrl: varchar('certificate_url', { length: 500 }).notNull(),
});
