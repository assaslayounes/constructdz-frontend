import { HardHat, Settings } from "lucide-react";

export function AuthBrand() {
  return (
    <section className="relative flex h-[368px] flex-col items-center overflow-hidden bg-brand-blue px-6 pt-[74px] text-white sm:h-[367px] sm:px-8 sm:pt-11 lg:h-[300px]">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent" />

      <div className="relative mb-8 flex h-[58px] w-[70px] items-center justify-center sm:mb-6 sm:h-16 sm:w-20">
        <HardHat className="absolute bottom-0 left-2 size-14 text-white sm:size-14" strokeWidth={2.8} />
        <Settings className="absolute right-2 top-0 size-7 text-white sm:size-7" fill="currentColor" strokeWidth={2.4} />
        <Settings className="absolute right-0 top-8 size-4 text-white sm:size-4" fill="currentColor" strokeWidth={2.4} />
      </div>

      <h1 className="text-center text-[48px] font-light leading-none tracking-wide sm:text-5xl lg:text-6xl">
        إنجاز 24
      </h1>

      <p className="mt-7 max-w-3xl text-center text-[18px] leading-8 text-white/95 sm:mt-7 sm:text-xl sm:leading-9 lg:text-2xl">
        المنصة الرائدة لإدارة مشاريع البناء في الجزائر. بذكاء واحترافية
      </p>
    </section>
  );
}
