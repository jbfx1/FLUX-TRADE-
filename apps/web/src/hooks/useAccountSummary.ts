import { useQuery } from '@tanstack/react-query';
import { getAccountSummary } from '../services/api';

export function useAccountSummary() {
  return useQuery({
    queryKey: ['account-summary'],
    queryFn: getAccountSummary,
    refetchInterval: 5000
  });
}
