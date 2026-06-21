export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-primary">Quiz Platform</h1>
        <p className="text-xl text-muted-foreground">
          Test your knowledge with our interactive quizzes
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-6 py-3 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
