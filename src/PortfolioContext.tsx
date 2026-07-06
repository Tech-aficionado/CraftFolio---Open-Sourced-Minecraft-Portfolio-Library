import { createContext, useContext, type ReactNode } from "react";
import type { PortfolioData, PortfolioOptions } from "./types";

type PortfolioCtx = PortfolioData & { options: PortfolioOptions };

const Ctx = createContext<PortfolioCtx | null>(null);

export function PortfolioProvider({
  value,
  children,
}: {
  value: PortfolioCtx;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio(): PortfolioCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePortfolio must be used within <MinecraftPortfolio>");
  return ctx;
}
