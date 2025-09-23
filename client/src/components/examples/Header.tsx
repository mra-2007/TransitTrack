import Header from '../Header';

export default function HeaderExample() {
  return <Header onMenuToggle={() => console.log('Menu toggle clicked')} />;
}