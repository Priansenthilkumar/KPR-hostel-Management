// src/data/menuData.js
// Full weekly hostel menu mapping: Day → Meal → [items]

export const menuData = {
  Monday: {
    Breakfast: ['Idly', 'Sambar', 'Coconut Chutney', 'Samba Rava Upma', 'Kesari'],
    Lunch: ['Steamed Rice', 'Potato Poriyal', 'Vathal/Puli Kulambu', 'Tomato Rasam', 'Fryums', 'Curd', 'Pickle'],
    Dinner: ['Chapathi', 'Kushka', 'Paneer Veg Makhani Gravy', 'Jam'],
  },
  Tuesday: {
    Breakfast: ['Pongal', 'Vada', 'Sambar', 'Coconut Chutney', 'Kichadi'],
    Lunch: ['Steamed Rice', 'Carrot, Beans & Cabbage (CBC) Poriyal', 'Moong Dal', 'Pepper Rasam', 'Appalam', 'Curd', 'Pickle'],
    Dinner: ['Variety Rice', 'Boiled Egg (1)', 'Veg Kuruma', 'Potato Chips'],
  },
  Wednesday: {
    Breakfast: ['Dosa', 'Gothsu', 'Kara Chutney', 'White Semiya'],
    Lunch: ['Steamed Rice', 'Kadambam', 'Veg Sambar', 'Garlic Rasam', 'Fryums', 'Curd', 'Pickle'],
    Dinner: ['Parotta', 'Chicken & Mushroom Gravy', 'Banana (1)'],
  },
  Thursday: {
    Breakfast: ['Idly', 'Thokku', 'Coconut Chutney', 'Tomato Semiya'],
    Lunch: ['Steamed Rice', 'Keerai Kootu', 'Thatapayuru Kulambu', 'Lemon Rasam', 'Appalam', 'Curd', 'Pickle'],
    Dinner: ['Wheat Dosa', 'Tamarind Rice', 'Tomato Sambar', 'Chutney', 'Pickle'],
  },
  Friday: {
    Breakfast: ['Dosa', 'Idiyappam (1 for Boys)', 'Tomato Gravy', 'Garlic Chutney', 'Rava Upma'],
    Lunch: ['Kushka', 'Steamed Rice', 'Grill Chicken', 'Cauliflower 65', 'Plain Kuruma', 'Pacha Puli Rasam', 'Appalam', 'Sweet Payasam', 'Curd', 'Pickle'],
    Dinner: ['Mushroom Briyani', 'Idiyappam (1 for Girls)', 'Onion Raita', 'Boiled Egg (1)'],
  },
  Saturday: {
    Breakfast: ['Onion Uthapam', 'Sambar', 'Beetroot Chutney', 'Kushka'],
    Lunch: ['Steamed Rice', 'Beetroot Poriyal', 'Mix Sambar', 'Paruppu Rasam', 'Appalam', 'Curd', 'Pickle'],
    Dinner: ['Chapathi', 'Mixed Vegetable Gravy', 'Jam'],
  },
  Sunday: {
    Breakfast: ['Maggi', 'Chana Masala', 'Full Boiled Egg', 'Bread Toast'],
    Lunch: [
      // Week 1
      'Chicken & Vegetable Briyani',
      'Onion Raita',
      // Week 2
      'Steamed Rice',
      'Chicken & Vegetable Gravy',
      // Week 3
      'Fish Fry',
      'Fish Gravy',
      'Pacha Puli Rasam',
    ],
    Dinner: [
      'Arisi Paruppu Sadam / Dosa',
      'Curd / Sambar',
      'Thuviyal / Chutney',
    ],
  },
};

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

export function getMenuItems(day, meal) {
  if (!day || !meal) return [];
  return menuData[day]?.[meal] || [];
}
