import Link from "next/link";

const Login = () => (
  <main className="w-full max-w-md mx-auto py-16 px-4 md:px-8">
    <h1 className="text-3xl md:text-5xl font-bold font-serif text-primary mb-8 text-center">Sign In</h1>
    <form className="flex flex-col gap-6 bg-background border border-border rounded-xl shadow-lg p-8">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
        <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
        <input type="password" id="password" name="password" required className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <button type="submit" className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors">Sign In</button>
      <div className="flex justify-between text-sm mt-2">
        <Link href="/register" className="text-primary hover:underline">Create Account</Link>
        <Link href="/forgot-password" className="text-muted-foreground hover:underline">Forgot Password?</Link>
      </div>
    </form>
  </main>
);

export default Login;
