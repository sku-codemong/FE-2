import { Alert, AlertDescription } from './ui/alert';
import { Info, CheckCircle } from 'lucide-react';
import { apiBaseUrl } from '../services/api';

export function ApiStatusAlert() {
  const isConnected = Boolean(apiBaseUrl);

  if (isConnected) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          백엔드 API 연결됨: <span className="font-mono">{apiBaseUrl}</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        현재 Mock 데이터로 동작 중입니다. <code className="bg-blue-100 px-1 rounded">.env.local</code>에서{' '}
        <code className="bg-blue-100 px-1 rounded">VITE_API_BASE_URL</code>을 설정해 실제 서버에 연결하세요.
      </AlertDescription>
    </Alert>
  );
}
