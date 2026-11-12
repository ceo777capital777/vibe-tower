"use client";

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { openExternal } from "@/lib/telegram/client";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  children: ReactNode;
};

/** Ordinary anchor in a browser. Inside a Mini App, http(s) links go through Telegram. */
export function ExternalLink({ href, children, onClick, target, rel, ...rest }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (openExternal(href)) event.preventDefault();
  };

  return (
    <a href={href} target={target ?? "_blank"} rel={rel ?? "noopener noreferrer"} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
