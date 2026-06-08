"use client";

import { FileStack } from "lucide-react";
import { type ReactNode } from "react";

type ProjectEmptyProps = {
  children?: ReactNode;
  text?: ReactNode;
};

export function ProjectEmpty({ children, text = "还没有数据、添加一个吧" }: ProjectEmptyProps) {
  return (
    <div className="ask-project-manage-empty">
      <div className="ask-project-manage-empty__box">
        <div className="ask-project-manage-empty__sigil" aria-hidden="true">
          <FileStack size={62} strokeWidth={1.6} />
        </div>
        <div className="ask-project-manage-empty__box--text">{text}</div>
        {children}
      </div>
    </div>
  );
}
