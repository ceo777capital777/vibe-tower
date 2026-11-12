import { Fragment } from "react";
import { ExternalLink } from "@/components/ui/ExternalLink";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*[^*\s][^*]*\*)/g;

/** Рендерит строку с **жирным**, *курсивом*, `кодом` и [ссылками](https://…) без dangerouslySetInnerHTML */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        const link = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part);
        if (link) {
          return (
            <ExternalLink key={i} href={link[2]} rel="noopener noreferrer nofollow">
              {link[1]}
            </ExternalLink>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
