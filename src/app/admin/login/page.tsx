import { signInAction } from "@/app/admin/actions";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const setupRequired = query.setup === "required";
  const unauthorized = query.unauthorized === "1";
  const invalidCredentials = query.error === "credentials";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-md border-y border-border bg-background px-6 py-8 sm:px-8">
        <p className="text-sm font-semibold text-sage-700">Rawdat ul-Huda</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-brown-700">Owner sign in</h1>

        {setupRequired ? (
          <p className="mt-5 rounded-md border border-terracotta-500/40 bg-terracotta-500/10 p-4 text-sm leading-relaxed text-brown-600">
            The API is unavailable or not configured. Set up the backend service and try again.
          </p>
        ) : (
          <form action={signInAction} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-brown-600">
              Email
              <input
                required
                autoComplete="username"
                name="email"
                type="email"
                className="min-h-11 rounded-md border border-border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-brown-600">
              Password
              <input
                required
                autoComplete="current-password"
                name="password"
                type="password"
                className="min-h-11 rounded-md border border-border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-sage-600"
              />
            </label>
            {invalidCredentials && (
              <p role="alert" className="text-sm text-destructive">Email or password is incorrect.</p>
            )}
            {unauthorized && (
              <p role="alert" className="text-sm text-destructive">This account is not authorized to manage the site.</p>
            )}
            <button
              type="submit"
              className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sage-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-sage-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    </main>
  );
}