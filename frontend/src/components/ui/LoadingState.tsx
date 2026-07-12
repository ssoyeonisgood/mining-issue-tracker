interface LoadingStateProps {
  message?: string
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="loading-pulse" role="status" aria-live="polite">
      <div className="loading-bars" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <span>{message}</span>
    </div>
  )
}
