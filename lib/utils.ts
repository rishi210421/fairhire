import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isPastDeadline(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function calculateSkillMatch(studentSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0;
  
  const matchedSkills = studentSkills.filter(skill =>
    jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()) || 
                         skill.toLowerCase().includes(js.toLowerCase()))
  );
  
  return Math.round((matchedSkills.length / jobSkills.length) * 100);
}
