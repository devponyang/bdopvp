"use client";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorMessage({ 
  message = "데이터를 불러오는 중 오류가 발생했습니다.", 
  onRetry,
  showRetry = true 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold text-red-400 mb-2">오류 발생</h2>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>
        {showRetry && (
          <div className="space-y-3">
            {onRetry ? (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                다시 시도
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                페이지 새로고침
              </button>
            )}
            <div className="text-sm text-gray-400">
              문제가 계속 발생하면 관리자에게 문의해주세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







