import Preloader from '../components/Preloader';
import CustomCursor from '../components/CustomCursor';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Products from '../components/Products';

import Features from '../components/Features';
import Process from '../components/Process';
import Calculator from '../components/Calculator';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Partners from '../components/Partners';
import Blog from '../components/Blog';
import BookingCalendar from '../components/BookingCalendar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import Animations from '../components/Animations';
import ThemeInit from '../components/ThemeInit';

import { createServerClient } from '../utils/supabase/server';

export default async function Home() {
  const supabase = createServerClient();
  
  // Fetch data server-side
  const [blogsRes, productsRes] = await Promise.all([
    supabase.from('blogs').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('products').select('*').order('created_at', { ascending: false })
  ]);

  const blogs = blogsRes.data || [];
  const products = productsRes.data || [];

  return (
    <>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <Hero />
      <Stats />
      <Products initialProducts={products} />
      <Features />
      <Process />
      <Calculator />
      <Portfolio />
      <Testimonials />
      <Partners />
      <Blog initialBlogs={blogs} />
      <BookingCalendar />
      <Contact />
      <Footer />
      <MobileCTA />
      <Animations />
      <ThemeInit />
    </>
  );
}
