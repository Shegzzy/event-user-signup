import Link from 'next/link';

// interfaces
interface IProps {
  url?: string;
  text: string;
  active?: boolean;
  onClick?: () => void; // Add onClick as optional prop
}

const DropdownItem: React.FC<IProps> = ({ url, text, active, onClick }) => (
  <Link className={active ? 'button active' : 'button passive'} href={`/${url}`} onClick={onClick}>
    {text}
  </Link>
);

export default DropdownItem;
