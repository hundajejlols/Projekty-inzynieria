import { ShoppingCart, Utensils, Car, Film, Home, HeartPulse, Package } from 'lucide-react';

export const CATEGORIES = [
    'Zakupy', 
    'Jedzenie', 
    'Transport', 
    'Rozrywka', 
    'Dom', 
    'Zdrowie', 
    'Inne'
];

export const CATEGORY_ICONS_QB = {
    'Zakupy': ShoppingCart,
    'Jedzenie': Utensils,
    'Transport': Car,
    'Rozrywka': Film,
    'Dom': Home,
    'Zdrowie': HeartPulse,
    'Inne': Package
};

// --- NOWE: KURSY WALUT (BAZA: PLN) ---
export const EXCHANGE_RATES = {
    'PLN': 1.0,
    'EUR': 4.30, // 1 EUR = 4.30 PLN
    'USD': 4.00  // 1 USD = 4.00 PLN
};