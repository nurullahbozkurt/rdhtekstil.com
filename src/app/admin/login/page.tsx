import { AdminLoginForm } from "@/components/admin/login-form";
import { getMessages } from "@/i18n/messages";

export default function AdminLoginPage() {
  const messages = getMessages("tr").admin;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-heading text-3xl font-medium tracking-tight">{messages.loginTitle}</h1>
      <div className="mt-8">
        <AdminLoginForm messages={messages} />
      </div>
    </main>
  );
}
