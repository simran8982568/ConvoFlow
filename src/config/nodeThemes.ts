// Node theme configuration for Flow Builder
export interface NodeTheme {
  background: string;
  border: string;
  headerBg: string;
  headerText: string;
  accent: string;
  iconBg: string;
}

export const nodeThemes: Record<string, NodeTheme> = {
  flowStart: {
    background: '#E8FFF1',
    border: '#27D478',
    headerBg: '#16a34a',
    headerText: '#ffffff',
    accent: '#16a34a',
    iconBg: '#dcfce7',
  },
  message: {
    background: '#E6F2FF',
    border: '#4FA8FF',
    headerBg: '#2563eb',
    headerText: '#ffffff',
    accent: '#2563eb',
    iconBg: '#dbeafe',
  },
  mediaButtons: {
    background: '#E6F4FF',
    border: '#5BB3FF',
    headerBg: '#0ea5e9',
    headerText: '#ffffff',
    accent: '#0ea5e9',
    iconBg: '#e0f2fe',
  },
  list: {
    background: '#FFF7E6',
    border: '#FFB84D',
    headerBg: '#ea580c',
    headerText: '#ffffff',
    accent: '#ea580c',
    iconBg: '#ffedd5',
  },
  askQuestion: {
    background: '#FFE6E6',
    border: '#FF6B6B',
    headerBg: '#dc2626',
    headerText: '#ffffff',
    accent: '#dc2626',
    iconBg: '#fee2e2',
  },
  setAttribute: {
    background: '#E5FFF4',
    border: '#38C89A',
    headerBg: '#14b8a6',
    headerText: '#ffffff',
    accent: '#14b8a6',
    iconBg: '#ccfbf1',
  },
  addTag: {
    background: '#FFF0E6',
    border: '#FF9A5F',
    headerBg: '#f97316',
    headerText: '#ffffff',
    accent: '#f97316',
    iconBg: '#fed7aa',
  },
  apiRequest: {
    background: '#F3E6FF',
    border: '#B478FF',
    headerBg: '#9333ea',
    headerText: '#ffffff',
    accent: '#9333ea',
    iconBg: '#f3e8ff',
  },
  template: {
    background: '#F0F0FF',
    border: '#8F8FFF',
    headerBg: '#6366f1',
    headerText: '#ffffff',
    accent: '#6366f1',
    iconBg: '#e0e7ff',
  },
};

export const whatsappColors = {
  botBubble: '#DCF8C6',
  userBubble: '#FFFFFF',
  header: '#075E54',
  background: '#e5ddd5',
  buttonBorder: '#BDE8CC',
  buttonText: '#0B9A58',
  tickGray: '#999999',
  tickBlue: '#4FC3F7',
};

export const canvasColors = {
  background: '#FAFAFA',
  dotGrid: 'rgba(0,0,0,0.08)',
  border: '#e5e7eb',
};

export const getNodeTheme = (nodeType: string): NodeTheme => {
  return nodeThemes[nodeType] || nodeThemes.message;
};