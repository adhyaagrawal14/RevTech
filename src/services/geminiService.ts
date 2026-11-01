import { AIDecisionResult } from '../types';

/** AI adapter placeholder. Connect only after the FastAPI AI routes and schemas
 * have been confirmed in Swagger. No client-side AI or synthetic fallback data. */
const notConnected = () => new Error('RevTech AI is not connected yet. This feature will be enabled after the backend API is integrated.');

export const GeminiService = {
  checkHealth: async (): Promise<{ status: string; hasApiKey: boolean }> => ({ status: 'not_connected', hasApiKey: false }),

  getDecision: async (_mode: 'repair_vs_replace' | 'worth_buying' | 'spare_parts_query', _payload: unknown): Promise<AIDecisionResult> => {
    throw notConnected();
  },

  getTroubleshooting: async (_payload: {
    productModel: string;
    symptomCategory: string;
    description: string;
    deviceAge?: string;
    warrantyStatus?: string;
  }) => {
    throw notConnected();
  },

  queryMapsGrounding: async (_query: string, _latitude?: number, _longitude?: number) => ({
    isGroundingUsed: false,
    text: 'Location search is not connected yet. No service listings are being displayed.',
    places: [] as { title: string; uri: string; reviewSnippets?: string[] }[],
  }),

  sendChatMessage: async (
    _messages: { role: 'user' | 'model'; content: string }[],
    _model?: string,
    _enableMaps?: boolean,
    _latitude?: number,
    _longitude?: number
  ) => ({
    role: 'model',
    text: 'RevTech AI chat is not connected yet. It will be available after the backend AI service is integrated.',
    places: [],
    modelUsed: 'Not connected',
  }),
};
