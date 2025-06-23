import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LayoutES({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
