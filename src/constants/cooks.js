// src/constants/cooks.js
import { adminManagementService } from '../services/adminManagementService';

export const getActiveCookNames = () => {
  const cooks = adminManagementService.getCooks();
  return cooks.filter((c) => c.status === 'Active').map((c) => c.name);
};

export const COOKS = getActiveCookNames();

export const COOK_COLORS = {
  'Chef Nandhakumar': '#174351',
  'Master Munees': '#286072',
  'Master Balu': '#52B74A',
  'Master Sombu': '#E65100',
  'Master Panty': '#D32F2F',
  'Master Suthan': '#44A03C',
  'Master Baktha': '#133844',
};
