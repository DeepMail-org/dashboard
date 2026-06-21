import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  header?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
}

export function PageWrapper({ header, children, noPadding }: PageWrapperProps) {
  return (
    <div className="flex flex-1 w-full flex-col min-h-0 bg-[#0a0c10] p-4 lg:p-6">
      <div className="flex flex-1 w-full flex-col min-h-0 overflow-hidden rounded-[20px] border border-white/5 bg-[#ebebeb] dark:bg-[#131315] relative shadow-lg">
        {header && (
          <div className="shrink-0 border-b border-white/5 px-6 py-5">
            {header}
          </div>
        )}
        <div className={cn("flex-1 flex flex-col min-h-0", noPadding ? "" : "overflow-y-auto p-6")}>
          {children}
        </div>
      </div>
    </div>
  );
}
