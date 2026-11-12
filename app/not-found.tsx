import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[88svh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/fog-towers.webp" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_9_13/0.4),#07090d_85%)]" />
        <div className="grid-lines absolute inset-0" />
      </div>
      <Container className="text-center">
        <p className="eyebrow mb-6">Ошибка 404</p>
        <h1 className="font-display text-[clamp(5rem,18vw,13rem)] font-medium leading-none tracking-[-0.06em] text-gradient">404</h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-white/70">
          Такого этажа в башне нет. Возможно, страница переехала или адрес набран с ошибкой.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" arrow>
            На главную
          </ButtonLink>
          <ButtonLink href="/library" size="lg" variant="secondary">
            Library
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
