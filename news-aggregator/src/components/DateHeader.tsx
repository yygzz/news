import { formatFullDate } from '../utils/helpers';

interface DateHeaderProps {
  lastUpdated?: string;
}

export function DateHeader({ lastUpdated }: DateHeaderProps) {
  const updatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="mb-5">
      <h1 className="text-[28px] font-bold text-gray-900 leading-tight">今日简报</h1>
      <p className="text-sm text-gn-gray mt-1">{formatFullDate(new Date())}</p>
      {updatedLabel && (
        <p className="text-xs text-gn-gray mt-1">资讯更新于 {updatedLabel}</p>
      )}
    </div>
  );
}
