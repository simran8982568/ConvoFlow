import { useToast } from '@/hooks/use-toast';

export interface Business {
  id: number;
  name: string;
  signupDate: string;
  plan: string;
  campaigns: number;
  messages: number;
  status: string;
  automations: number;
  topCategory: string;
  usage: number;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  lastActive?: string;
}

export interface BusinessStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalMessages: number;
  totalCampaigns: number;
  monthlyGrowth: number;
  planDistribution: {
    free: number;
    starter: number;
    pro: number;
    enterprise: number;
  };
}

export const useBusinessAPI = () => {
  const { toast } = useToast();

  const fetchBusinesses = async (): Promise<Business[]> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/businesses');
      // if (!response.ok) throw new Error('Failed to fetch businesses');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      return [
        {
          id: 1,
          name: "TechCorp Solutions",
          signupDate: "2024-01-15",
          plan: "Enterprise",
          campaigns: 45,
          messages: 12500,
          status: "Active",
          automations: 8,
          topCategory: "Marketing",
          usage: 85,
          email: "admin@techcorp.com",
          phone: "+1-555-0123",
          website: "https://techcorp.com",
          industry: "Technology",
          lastActive: "2024-07-18"
        },
        {
          id: 2,
          name: "Digital Marketing Pro",
          signupDate: "2024-02-10",
          plan: "Pro",
          campaigns: 23,
          messages: 5800,
          status: "Active",
          automations: 5,
          topCategory: "Sales",
          usage: 67,
          email: "contact@digitalmarketing.com",
          phone: "+1-555-0124",
          website: "https://digitalmarketing.com",
          industry: "Marketing",
          lastActive: "2024-07-17"
        },
        {
          id: 3,
          name: "StartupXYZ",
          signupDate: "2024-03-05",
          plan: "Starter",
          campaigns: 8,
          messages: 1200,
          status: "Inactive",
          automations: 2,
          topCategory: "Support",
          usage: 34,
          email: "hello@startupxyz.com",
          phone: "+1-555-0125",
          website: "https://startupxyz.com",
          industry: "Startup",
          lastActive: "2024-07-10"
        },
        {
          id: 4,
          name: "Global Retail Co",
          signupDate: "2024-01-28",
          plan: "Enterprise",
          campaigns: 67,
          messages: 18900,
          status: "Active",
          automations: 12,
          topCategory: "E-commerce",
          usage: 92,
          email: "support@globalretail.com",
          phone: "+1-555-0126",
          website: "https://globalretail.com",
          industry: "Retail",
          lastActive: "2024-07-18"
        },
        {
          id: 5,
          name: "HealthTech Innovations",
          signupDate: "2024-04-12",
          plan: "Pro",
          campaigns: 31,
          messages: 7200,
          status: "Active",
          automations: 6,
          topCategory: "Healthcare",
          usage: 78,
          email: "info@healthtech.com",
          phone: "+1-555-0127",
          website: "https://healthtech.com",
          industry: "Healthcare",
          lastActive: "2024-07-18"
        }
      ];
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch businesses. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  const fetchBusinessStats = async (): Promise<BusinessStats> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/businesses/stats');
      // if (!response.ok) throw new Error('Failed to fetch business stats');
      // return await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock stats for now
      return {
        totalBusinesses: 5,
        activeBusinesses: 4,
        totalMessages: 45600,
        totalCampaigns: 174,
        monthlyGrowth: 12.5,
        planDistribution: {
          free: 0,
          starter: 1,
          pro: 2,
          enterprise: 2
        }
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch business statistics. Please try again.",
        variant: "destructive",
      });
      return {
        totalBusinesses: 0,
        activeBusinesses: 0,
        totalMessages: 0,
        totalCampaigns: 0,
        monthlyGrowth: 0,
        planDistribution: { free: 0, starter: 0, pro: 0, enterprise: 0 }
      };
    }
  };

  const updateBusinessStatus = async (businessId: number, status: 'Active' | 'Inactive'): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/superadmin/businesses/${businessId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      // if (!response.ok) throw new Error('Failed to update business status');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Success",
        description: `Business status updated to ${status}.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteBusiness = async (businessId: number): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/superadmin/businesses/${businessId}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Failed to delete business');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Business account has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business account. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchBusinesses,
    fetchBusinessStats,
    updateBusinessStatus,
    deleteBusiness,
  };
};
