import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
  return <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} /></button>;
}
