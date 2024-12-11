import { useQuery } from 'react-query';
import { getProperties } from '../api/property';

export function useProperties() {
  const { data: properties = [], isLoading, error } = useQuery('properties', getProperties);

  return {
    properties,
    isLoading,
    error,
  };
} 