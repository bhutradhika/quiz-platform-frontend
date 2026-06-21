export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatScore(score: number, maxScore: number): string {
  if (maxScore === 0) return "0%";
  return `${Math.round((score / maxScore) * 100)}%`;
}

export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}

export function formatLevel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    JAVASCRIPT: "bg-yellow-100 text-yellow-800",
    FRONTEND: "bg-purple-100 text-purple-800",
    BACKEND: "bg-green-100 text-green-800",
    JAVA: "bg-orange-100 text-orange-800",
    PYTHON: "bg-cyan-100 text-cyan-800",
    DATABASE: "bg-pink-100 text-pink-800",
    DEVOPS: "bg-indigo-100 text-indigo-800",
    MOBILE: "bg-rose-100 text-rose-800",
  };
  return colors[category.toUpperCase()] || "bg-gray-100 text-gray-800";
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800",
    INTERMEDIATE: "bg-blue-100 text-blue-800",
    ADVANCED: "bg-purple-100 text-purple-800",
    EXPERT: "bg-red-100 text-red-800",
  };
  return colors[level.toUpperCase()] || "bg-gray-100 text-gray-800";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
