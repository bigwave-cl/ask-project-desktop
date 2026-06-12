"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ProjectManageTabItem = {
  key: string;
  label: string;
};

type ProjectManageTabProps = {
  activeKey: string;
  list: ProjectManageTabItem[];
  onActiveChange: (key: string) => void;
};

export function ProjectManageTab({ activeKey, list, onActiveChange }: ProjectManageTabProps) {
  if (list.length === 0) {
    return null;
  }

  return (
    <div className="min-h-[38px] overflow-hidden">
      <div
        className="flex min-h-[38px] items-stretch overflow-x-auto rounded-[14px] border border-apm-subtle bg-[rgba(7,13,15,.46)]"
        role="tablist"
        aria-label="项目分组"
      >
        {list.map((item) => (
          <Button
            type="button"
            variant="projectPlain"
            size="projectPlain"
            className={cn(
              "min-w-max cursor-pointer border-0 bg-transparent px-[14px] text-[var(--apm-text-muted)] tracking-normal transition-colors",
              activeKey === item.key &&
                "bg-apm-tab-active text-[var(--apm-text-main)]"
            )}
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            onClick={() => onActiveChange(item.key)}
          >
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
