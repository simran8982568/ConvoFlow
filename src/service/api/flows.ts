// Flow API Service with Mock Mode Toggle
// Set MOCK_MODE to false when ready to connect to Laravel backend
import axios from 'axios';
import { Flow, dummyFlows, createEmptyFlow } from '@/data/dummyFlows';
import { WhatsAppTemplate, dummyTemplates } from '@/data/dummyTemplates';
import { Tag, dummyTags } from '@/data/dummyTags';

const MOCK_MODE = true; // Toggle this to switch between mock and real API

// API client configuration
const API = axios.create({
  baseURL: 'https://ayuchatadmin.agnistokatechnology.com/api',
  withCredentials: true,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simulate API delay for realistic mock behavior
const mockDelay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// FLOW CRUD OPERATIONS
// ============================================================================

/**
 * Get all flows
 * Real API: GET /api/admin/flows
 */
export const listFlows = async (): Promise<Flow[]> => {
  if (MOCK_MODE) {
    await mockDelay();
    const storedFlows = localStorage.getItem('ayuchat_flows');
    return storedFlows ? JSON.parse(storedFlows) : dummyFlows;
  }

  const response = await API.get('/admin/flows');
  return response.data;
};

/**
 * Get a single flow by ID
 * Real API: GET /api/admin/flows/{flow}
 */
export const getFlow = async (id: string): Promise<Flow> => {
  if (MOCK_MODE) {
    await mockDelay();
    const flows = await listFlows();
    const flow = flows.find((f) => f.id === id);
    if (!flow) {
      throw new Error(`Flow with ID ${id} not found`);
    }
    return flow;
  }

  const response = await API.get(`/admin/flows/${id}`);
  return response.data;
};

/**
 * Create a new flow
 * Real API: POST /api/admin/flows
 */
export const createFlow = async (
  payload: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Flow> => {
  if (MOCK_MODE) {
    await mockDelay();
    const flows = await listFlows();
    const newFlow: Flow = {
      ...payload,
      id: `flow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedFlows = [...flows, newFlow];
    localStorage.setItem('ayuchat_flows', JSON.stringify(updatedFlows));
    return newFlow;
  }

  const response = await API.post('/admin/flows', payload);
  return response.data;
};

/**
 * Update an existing flow
 * Real API: PUT /api/admin/flows/{flow}
 */
export const updateFlow = async (
  id: string,
  payload: Partial<Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Flow> => {
  if (MOCK_MODE) {
    await mockDelay();
    const flows = await listFlows();
    const index = flows.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new Error(`Flow with ID ${id} not found`);
    }
    const updatedFlow: Flow = {
      ...flows[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    flows[index] = updatedFlow;
    localStorage.setItem('ayuchat_flows', JSON.stringify(flows));
    return updatedFlow;
  }

  const response = await API.put(`/admin/flows/${id}`, payload);
  return response.data;
};

/**
 * Delete a flow
 * Real API: DELETE /api/admin/flows/{flow}
 */
export const deleteFlow = async (id: string): Promise<void> => {
  if (MOCK_MODE) {
    await mockDelay();
    const flows = await listFlows();
    const filteredFlows = flows.filter((f) => f.id !== id);
    localStorage.setItem('ayuchat_flows', JSON.stringify(filteredFlows));
    return;
  }

  await API.delete(`/admin/flows/${id}`);
};

// ============================================================================
// TEMPLATE OPERATIONS
// ============================================================================

/**
 * Fetch WhatsApp templates from Meta
 * Real API: GET /api/admin/templates/meta
 */
export const fetchMetaTemplates = async (): Promise<WhatsAppTemplate[]> => {
  if (MOCK_MODE) {
    await mockDelay();
    return dummyTemplates;
  }

  const response = await API.get('/admin/templates/meta');
  return response.data;
};

/**
 * Get a specific template by ID
 * Real API: GET /api/admin/templates/meta/{templateId}
 */
export const getTemplate = async (id: string): Promise<WhatsAppTemplate> => {
  if (MOCK_MODE) {
    await mockDelay();
    const template = dummyTemplates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }
    return template;
  }

  const response = await API.get(`/admin/templates/meta/${id}`);
  return response.data;
};

// ============================================================================
// TAG OPERATIONS
// ============================================================================

/**
 * Get all available tags
 * Real API: GET /api/admin/tags
 */
export const fetchTags = async (): Promise<Tag[]> => {
  if (MOCK_MODE) {
    await mockDelay();
    return dummyTags;
  }

  const response = await API.get('/admin/tags');
  return response.data;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Export flow as JSON file
 */
export const exportFlowAsJSON = (flow: Flow): void => {
  const dataStr = JSON.stringify(flow, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${flow.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Import flow from JSON file
 */
export const importFlowFromJSON = (file: File): Promise<Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flow = JSON.parse(e.target?.result as string);
        // Remove id, createdAt, updatedAt to create as new flow
        const { id, createdAt, updatedAt, ...flowData } = flow;
        resolve(flowData);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Initialize mock data in localStorage if not exists
 */
export const initializeMockData = (): void => {
  if (MOCK_MODE && !localStorage.getItem('ayuchat_flows')) {
    localStorage.setItem('ayuchat_flows', JSON.stringify(dummyFlows));
  }
};