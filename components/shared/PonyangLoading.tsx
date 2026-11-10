interface PonyangLoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function PonyangLoading({
  message = '기록을 불러오고 있습니다.',
  size = 'md',
}: PonyangLoadingProps) {
  return (
    <div role="status" aria-live="polite" className="panel panel-pad">
      <p className="data-caption">{message}</p>
      <div
        aria-hidden="true"
        className="loading-pulse"
        style={{ height: size === 'sm' ? 80 : size === 'lg' ? 280 : 180 }}
      />
    </div>
  )
}
