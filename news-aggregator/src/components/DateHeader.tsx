import { formatFullDate } from '../utils/helpers';

export function DateHeader() {
  return (
    <div className="mb-5">
      <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Your briefing</h1>
      <p className="text-sm text-gn-gray mt-1">{formatFullDate(new Date())}</p>
    </div>
  );
}
