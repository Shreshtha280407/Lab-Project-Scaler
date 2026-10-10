import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Brand() {
  return <Link to="/home" className="brand" aria-label="ShopKart"><span className="brand-mark"><Icon name="bag" size={22} /></span><span>ShopKart<span className="brand-dot">.</span></span></Link>;
}
