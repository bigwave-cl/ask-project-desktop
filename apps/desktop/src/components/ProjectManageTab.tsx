"use client";

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
    <div className="ask-project-manage-tab">
      <div className="apm-tabs" role="tablist" aria-label="项目分组">
        {list.map((item) => (
          <button
            className={activeKey === item.key ? "apm-tab apm-tab--selected" : "apm-tab"}
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            onClick={() => onActiveChange(item.key)}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
