import { KeyRound } from "lucide-react";

export function NotConfigured() {
  return (
    <div role="status" className="glass mb-5 flex gap-4 rounded-3xl border-amber-300/20 p-5 md:p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-amber-300/30 bg-amber-300/10 text-amber-200">
        <KeyRound className="size-5" aria-hidden />
      </span>
      <div className="text-sm leading-relaxed">
        <p className="font-bold text-white">Генератор ещё не подключён</p>
        <p className="mt-1 text-white/70">
          На сервере не задан ключ AI-провайдера, поэтому генерация сейчас недоступна. Мы не подставляем заготовленные
          ответы — результат появится только от реальной модели.
        </p>
        <p className="mt-2 text-white/50">
          Для владельца сайта: добавьте <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.8rem]">OPENAI_API_KEY</code> или{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.8rem]">ANTHROPIC_API_KEY</code> в переменные окружения
          сервера и перезапустите приложение.
        </p>
      </div>
    </div>
  );
}
