import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function ProfileShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#fff7f2]">
      <div className="mx-auto w-full max-w-[430px] px-6 pb-8 pt-3 sm:max-w-[620px] md:max-w-[760px] lg:max-w-[920px]">
        <header className="relative mb-7 flex min-h-12 items-center justify-center">
          <Link to="/" aria-label="رجوع" className="absolute left-0 top-1 text-brand-brown">
            <ArrowLeft className="size-7" />
          </Link>
          <h1 className="text-center text-3xl font-semibold text-brand-brown sm:text-4xl">{title}</h1>
        </header>
        {children}
      </div>
    </section>
  );
}
