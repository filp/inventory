import type { Label as LabelT } from '@server/labels/schema';

export const Label = ({ label }: { label: LabelT }) => (
  <span
    title={label.description ?? undefined}
    className="rounded-lg py-1 px-2 text-xs text-white"
    style={{ backgroundColor: label.color }}
  >
    {label.name}
  </span>
);

export const LabelList = ({ labels }: { labels: LabelT[] }) => (
  <div className="flex flex-row flex-wrap items-center justify-start gap-1">
    {labels.map((label) => (
      <Label key={label.id} label={label} />
    ))}
  </div>
);
