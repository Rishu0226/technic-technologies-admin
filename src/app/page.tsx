import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-technic-bg flex items-center justify-center p-6">
      <div className="bg-white border border-technic-border rounded-3xl shadow-tn-lg p-10 text-center max-w-md w-full">
        <Image
          src="/Assest/logo-brand.png"
          alt="Technic Technologies"
          width={240}
          height={64}
          className="h-14 w-auto mx-auto mb-6"
          priority
        />
        <h1 className="text-2xl font-semibold text-technic-text">Technic Technologies</h1>
        <p className="text-technic-secondary mt-2 mb-6">Admin workspace for content and operations.</p>
        <Link
          href="/admin/login"
          className="inline-flex bg-brand-gradient text-white px-6 py-3 rounded-xl font-semibold shadow-tn-sm"
        >
          Go to login
        </Link>
      </div>
    </main>
  );
}
