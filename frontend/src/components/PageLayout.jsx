import Navbar from './Navbar';
import Icon from './Icon';

export function PageHeading({ eyebrow, title, subtitle, action }) {
  return <header className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1 className="page-title">{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{action}</header>;
}

export function Notice({ children }) {
  return <div className="notice" role="alert"><Icon name="alert" size={20} /><span>{children}</span></div>;
}

export function LoadingState({ children }) {
  return <div className="loading-state" role="status"><span className="loading-spinner" />{children}</div>;
}

export function EmptyState({ icon = 'bag', title, children }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={30} /></span><h2>{title}</h2>{children}</div>;
}

export default function PageLayout({ children, className = '' }) {
  return <div className="site-layout"><Navbar /><main className={`page-container ${className}`}>{children}</main><footer className="site-footer"><span className="footer-brand">ShopKart.</span><span>A little discovery. A lot to love.</span></footer></div>;
}
