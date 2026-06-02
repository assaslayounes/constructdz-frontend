import { HardHat } from "lucide-react";

export function AuthBrand() {
  return (
    <section className="flex h-[300px] flex-col items-center bg-brand-blue px-6 pt-10 text-white sm:h-[367px] sm:px-8 sm:pt-11 lg:h-[300px]">
      <HardHat className="mb-1 size-14 sm:mb-6 sm:size-8" />
      <h1 className="text-4xl sm:text-5xl lg:text-6xl">Injaz24</h1>
      <p className="mt-5 max-w-3xl text-center text-base leading-8 sm:mt-7 sm:text-xl sm:leading-9 lg:text-2xl">المنصة الرائدة لإدارة مشاريع البناء في الجزائر. بذكاء واحترافية</p>
    </section>
  );
}
