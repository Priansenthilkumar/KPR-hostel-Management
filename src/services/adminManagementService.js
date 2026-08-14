// src/services/adminManagementService.js
import { menuData } from '../data/menuData';

const MENU_STORAGE_KEY = 'kpr_custom_food_menu';
const COOKS_STORAGE_KEY = 'kpr_cooks_data_v2';
const BLOCKS_STORAGE_KEY = 'kpr_hostel_blocks_data_v2';

export const DEFAULT_COOKS = [
  { id: 'cook-1', name: 'Chef Nandhakumar', specialty: 'South Indian & Feast Special', shift: 'Morning / Day', contact: '+91 98421 12345', status: 'Active' },
  { id: 'cook-2', name: 'Master Munees', specialty: 'Tiffin & Gravies', shift: 'Morning', contact: '+91 98421 23456', status: 'Active' },
  { id: 'cook-3', name: 'Master Balu', specialty: 'Rice & Meals', shift: 'Afternoon', contact: '+91 98421 34567', status: 'Active' },
  { id: 'cook-4', name: 'Master Sombu', specialty: 'Chapathi & Dinner', shift: 'Night', contact: '+91 98421 45678', status: 'Active' },
  { id: 'cook-5', name: 'Master Panty', specialty: 'Breakfast Snacks', shift: 'Morning', contact: '+91 98421 56789', status: 'Active' },
  { id: 'cook-6', name: 'Master Suthan', specialty: 'Special Curry & Biryani', shift: 'Full Day', contact: '+91 98421 67890', status: 'Active' },
  { id: 'cook-7', name: 'Master Baktha', specialty: 'Desserts & Sweets', shift: 'Evening', contact: '+91 98421 78901', status: 'Active' },
];

export const DEFAULT_HOSTEL_BLOCKS = [
  { id: 'blk-1', name: 'Pallavan Hostel', code: 'BLK-PAL', type: 'Boys Hostel', capacity: 250, rooms: 62, warden: 'Dr. M. Senthil', status: 'Active' },
  { id: 'blk-2', name: 'Cheran Hostel', code: 'BLK-CHE', type: 'Boys Hostel', capacity: 230, rooms: 58, warden: 'Mr. K. Ramu', status: 'Active' },
  { id: 'blk-3', name: 'Thiruvalluvar GF', code: 'BLK-TVG', type: 'Girls Hostel', capacity: 160, rooms: 40, warden: 'Mrs. S. Lakshmi', status: 'Active' },
  { id: 'blk-4', name: 'Thiruvalluvar 1st F', code: 'BLK-TV1', type: 'Girls Hostel', capacity: 160, rooms: 40, warden: 'Ms. P. Revathi', status: 'Active' },
  { id: 'blk-5', name: 'Thiruvalluvar 2nd F', code: 'BLK-TV2', type: 'Girls Hostel', capacity: 160, rooms: 40, warden: 'Dr. R. Anuradha', status: 'Active' },
  { id: 'blk-6', name: 'Thiruvalluvar 3rd F', code: 'BLK-TV3', type: 'Girls Hostel', capacity: 160, rooms: 40, warden: 'Mrs. V. Gomathi', status: 'Active' },
  { id: 'blk-7', name: 'Thiruvalluvar 4th F', code: 'BLK-TV4', type: 'Girls Hostel', capacity: 160, rooms: 40, warden: 'Mrs. K. Malathi', status: 'Active' },
  { id: 'blk-8', name: 'Bharathi Dorm', code: 'BLK-BHA', type: 'Boys Dormitory', capacity: 120, rooms: 15, warden: 'Mr. P. Sundar', status: 'Active' },
  { id: 'blk-9', name: 'Bharathi Intl.', code: 'BLK-INT', type: 'International PG', capacity: 80, rooms: 20, warden: 'Dr. G. Vignesh', status: 'Active' },
];

function dispatchEvent(eventName) {
  try {
    window.dispatchEvent(new CustomEvent(eventName));
    window.dispatchEvent(new CustomEvent('storage'));
  } catch (e) {
    console.warn('Dispatch event notice:', e);
  }
}

export const adminManagementService = {
  // ── 1. MESS MENU MANAGEMENT ──
  getMenu() {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      return saved ? JSON.parse(saved) : menuData;
    } catch {
      return menuData;
    }
  },

  saveFullMenu(updatedMenu) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedMenu));
    dispatchEvent('kpr_menu_updated');
    return updatedMenu;
  },

  updateMealItems(day, meal, itemsArray) {
    const currentMenu = this.getMenu();
    const updatedMenu = {
      ...currentMenu,
      [day]: {
        ...(currentMenu[day] || {}),
        [meal]: itemsArray,
      },
    };
    return this.saveFullMenu(updatedMenu);
  },

  resetMenu() {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuData));
    dispatchEvent('kpr_menu_updated');
    return menuData;
  },

  // ── 2. COOK MANAGEMENT ──
  getCooks() {
    try {
      const saved = localStorage.getItem(COOKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(COOKS_STORAGE_KEY, JSON.stringify(DEFAULT_COOKS));
      return DEFAULT_COOKS;
    } catch {
      return DEFAULT_COOKS;
    }
  },

  saveCooks(cooks) {
    localStorage.setItem(COOKS_STORAGE_KEY, JSON.stringify(cooks));
    dispatchEvent('kpr_cooks_updated');
    return cooks;
  },

  addCook(cook) {
    const cooks = this.getCooks();
    const newCook = {
      id: `cook-${Date.now()}`,
      name: cook.name.trim(),
      specialty: cook.specialty?.trim() || 'General Dining & Meals',
      shift: cook.shift || 'Day Shift',
      contact: cook.contact?.trim() || '+91 98421 00000',
      status: cook.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    cooks.unshift(newCook);
    this.saveCooks(cooks);
    return newCook;
  },

  updateCook(id, updates) {
    const cooks = this.getCooks();
    const idx = cooks.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Cook ID ${id} not found`);
    cooks[idx] = { ...cooks[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveCooks(cooks);
    return cooks[idx];
  },

  deleteCook(id) {
    const cooks = this.getCooks().filter((c) => c.id !== id);
    this.saveCooks(cooks);
  },

  toggleCookStatus(id) {
    const cooks = this.getCooks();
    const idx = cooks.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cooks[idx].status = cooks[idx].status === 'Active' ? 'Inactive' : 'Active';
      this.saveCooks(cooks);
    }
  },

  // ── 3. HOSTEL BLOCK MANAGEMENT ──
  getBlocks() {
    try {
      const saved = localStorage.getItem(BLOCKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(DEFAULT_HOSTEL_BLOCKS));
      return DEFAULT_HOSTEL_BLOCKS;
    } catch {
      return DEFAULT_HOSTEL_BLOCKS;
    }
  },

  saveBlocks(blocks) {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
    dispatchEvent('kpr_blocks_updated');
    return blocks;
  },

  addBlock(block) {
    const blocks = this.getBlocks();
    const newBlock = {
      id: `blk-${Date.now()}`,
      name: block.name.trim(),
      code: block.code?.trim().toUpperCase() || `BLK-${block.name.slice(0, 3).toUpperCase()}`,
      type: block.type || 'Boys Hostel',
      capacity: Number(block.capacity) || 150,
      rooms: Number(block.rooms) || 40,
      warden: block.warden?.trim() || 'Dr. KPR Warden',
      status: block.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    blocks.unshift(newBlock);
    this.saveBlocks(blocks);
    return newBlock;
  },

  updateBlock(id, updates) {
    const blocks = this.getBlocks();
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error(`Hostel Block ID ${id} not found`);
    blocks[idx] = { ...blocks[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveBlocks(blocks);
    return blocks[idx];
  },

  deleteBlock(id) {
    const blocks = this.getBlocks().filter((b) => b.id !== id);
    this.saveBlocks(blocks);
  },

  toggleBlockStatus(id) {
    const blocks = this.getBlocks();
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx !== -1) {
      blocks[idx].status = blocks[idx].status === 'Active' ? 'Inactive' : 'Active';
      this.saveBlocks(blocks);
    }
  },
};
