// constants.js  — shared across every screen
export const EXCHANGE_RATE  = 56;
export const BRAND_GOLD     = '#C5A373';
export const BRAND_GOLD_LIGHT = '#F2E9DC';
export const BRAND_DARK     = '#1A1110';
export const BRAND_BG       = '#F9F5F1';
export const BRAND_LIGHT_GOLD = '#EFE4D5';

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export const DAYS = ['SU','MO','TU','WE','TH','FR','SA'];

export const CAT_ICONS = {
  Wedding:'heart', Evening:'moon', Prom:'sparkles',
  'Quinceañera':'flower', Cocktail:'wine', Bridesmaid:'people', default:'shirt',
};

export const STATUS_MAP = {
  pending:   { bg:'#FDF9F2', text:'#B08968', icon:'time-outline',             label:'PENDING'   },
  confirmed: { bg:'#E8F5E9', text:'#388E3C', icon:'checkmark-circle-outline', label:'CONFIRMED' },
  cancelled: { bg:'#F9F2F2', text:'#D32F2F', icon:'close-circle-outline',     label:'CANCELLED' },
  completed: { bg:'#E3F2FD', text:'#1565C0', icon:'ribbon-outline',           label:'COMPLETED' },
};

export const formatPHP = (usd) => `₱${(usd * EXCHANGE_RATE).toLocaleString()}`;

export const toDateStr = (d) => {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const toSqlDate = (date) => {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60000).toISOString().split('T')[0];
};

export const fmtDate = (str) => {
  if (!str) return '—';
  const d = new Date(str);
  return `${MONTHS[d.getMonth()].slice(0, 3).toUpperCase()} ${d.getDate()}, ${d.getFullYear()}`;
};

export const sameDay = (a, b) => a && b && toDateStr(a) === toDateStr(b);

export const inRange = (date, s, e) => {
  if (!date || !s || !e) return false;
  const ds = toDateStr(date);
  return ds > toDateStr(s) && ds < toDateStr(e);
};