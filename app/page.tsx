import { UserList } from "@/components/user-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Create, read, update, and delete users connected to MongoDB Atlas.
          </p>
        </header>

        {/* CRUD interface */}
        <UserList />

        {/* Footer */}
        <footer className="mt-12 border-t pt-6">
          <p className="text-xs text-muted-foreground text-center">
            {"Built with Next.js, MongoDB Atlas & Vercel. Passwords hashed with bcrypt."}
          </p>
        </footer>
      </div>
    </main>
  );
}
