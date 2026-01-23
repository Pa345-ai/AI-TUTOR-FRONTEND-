export type Curriculum = "lk" | "international";

export const grades: string[] = Array.from({ length: 13 }, (_, i) => String(i + 1));

export const lkSubjects: string[] = [
  "Mathematics",
  "Science",
  "English",
  "Sinhala",
  "Tamil",
  "History",
  "Geography",
  "ICT",
  "Civics",
  "Buddhism",
  "Catholicism/Christianity",
  "Islam",
  "Hinduism",
  "Commerce",
  "Business Studies",
  "Accounting",
  "Economics",
  "Health & PE",
  "Aesthetics",
];

export const internationalSubjects: string[] = [
  "Mathematics",
  "English",
  "Science",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "History",
  "Geography",
  "Business",
];

export function getSubjects(curriculum: Curriculum): string[] {
  return curriculum === "lk" ? lkSubjects : internationalSubjects;
}
