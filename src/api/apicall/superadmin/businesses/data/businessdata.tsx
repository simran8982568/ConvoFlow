import { useState, useEffect } from 'react';
import { useBusinessAPI, Business, BusinessStats } from '../businessapi';

export interface BusinessFilters {
  searchTerm: string;
  planFilter: string;
  statusFilter: string;
  industryFilter: string;
}

export const useBusinessData = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BusinessFilters>({
    searchTerm: '',
    planFilter: 'all',
    statusFilter: 'all',
    industryFilter: 'all'
  });

  const businessAPI = useBusinessAPI();

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const [businessData, statsData] = await Promise.all([
        businessAPI.fetchBusinesses(),
        businessAPI.fetchBusinessStats()
      ]);
      setBusinesses(businessData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name
      .toLowerCase()
      .includes(filters.searchTerm.toLowerCase());
    
    const matchesPlan = filters.planFilter === 'all' || 
      business.plan.toLowerCase() === filters.planFilter;
    
    const matchesStatus = filters.statusFilter === 'all' || 
      business.status.toLowerCase() === filters.statusFilter.toLowerCase();
    
    const matchesIndustry = filters.industryFilter === 'all' || 
      business.industry?.toLowerCase() === filters.industryFilter.toLowerCase();

    return matchesSearch && matchesPlan && matchesStatus && matchesIndustry;
  });

  const updateBusinessStatus = async (businessId: number, status: 'Active' | 'Inactive') => {
    const success = await businessAPI.updateBusinessStatus(businessId, status);
    if (success) {
      setBusinesses(prev => 
        prev.map(business => 
          business.id === businessId 
            ? { ...business, status }
            : business
        )
      );
      // Refresh stats
      const newStats = await businessAPI.fetchBusinessStats();
      setStats(newStats);
    }
    return success;
  };

  const deleteBusiness = async (businessId: number) => {
    const success = await businessAPI.deleteBusiness(businessId);
    if (success) {
      setBusinesses(prev => prev.filter(business => business.id !== businessId));
      // Refresh stats
      const newStats = await businessAPI.fetchBusinessStats();
      setStats(newStats);
    }
    return success;
  };

  const updateFilters = (newFilters: Partial<BusinessFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      planFilter: 'all',
      statusFilter: 'all',
      industryFilter: 'all'
    });
  };

  const getUniqueIndustries = () => {
    const industries = businesses
      .map(business => business.industry)
      .filter((industry): industry is string => Boolean(industry));
    return [...new Set(industries)];
  };

  const getPlanDistribution = () => {
    if (!stats) return [];
    
    return [
      { name: 'Free', value: stats.planDistribution.free, color: '#6B7280' },
      { name: 'Starter', value: stats.planDistribution.starter, color: '#3B82F6' },
      { name: 'Pro', value: stats.planDistribution.pro, color: '#10B981' },
      { name: 'Enterprise', value: stats.planDistribution.enterprise, color: '#8B5CF6' }
    ].filter(plan => plan.value > 0);
  };

  const getStatusDistribution = () => {
    const active = filteredBusinesses.filter(b => b.status === 'Active').length;
    const inactive = filteredBusinesses.filter(b => b.status === 'Inactive').length;
    
    return [
      { name: 'Active', value: active, color: '#10B981' },
      { name: 'Inactive', value: inactive, color: '#EF4444' }
    ].filter(status => status.value > 0);
  };

  const getTopPerformers = (limit: number = 5) => {
    return [...businesses]
      .sort((a, b) => b.messages - a.messages)
      .slice(0, limit);
  };

  const getRecentSignups = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return businesses.filter(business => 
      new Date(business.signupDate) >= cutoffDate
    ).sort((a, b) => 
      new Date(b.signupDate).getTime() - new Date(a.signupDate).getTime()
    );
  };

  return {
    // Data
    businesses: filteredBusinesses,
    allBusinesses: businesses,
    stats,
    loading,
    error,
    filters,
    
    // Actions
    loadBusinesses,
    updateBusinessStatus,
    deleteBusiness,
    updateFilters,
    resetFilters,
    
    // Computed data
    getUniqueIndustries,
    getPlanDistribution,
    getStatusDistribution,
    getTopPerformers,
    getRecentSignups,
    
    // Counts
    totalBusinesses: businesses.length,
    filteredCount: filteredBusinesses.length,
    activeCount: filteredBusinesses.filter(b => b.status === 'Active').length,
    inactiveCount: filteredBusinesses.filter(b => b.status === 'Inactive').length
  };
};
