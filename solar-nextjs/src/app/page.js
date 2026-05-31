import Preloader from '@/shared/components/Preloader';
import CustomCursor from '@/shared/components/CustomCursor';
import Navbar from '@/shared/components/Navbar';
import Hero from '@/features/landing/components/Hero';
import Stats from '@/features/landing/components/Stats';
import Products from '@/features/products/components/Products';

import Features from '@/features/landing/components/Features';
import Process from '@/features/landing/components/Process';
import Calculator from '@/features/calculator/components/Calculator';
import Portfolio from '@/features/products/components/Portfolio';
import Testimonials from '@/features/landing/components/Testimonials';
import Partners from '@/features/landing/components/Partners';
import Blog from '@/features/landing/components/Blog';
import BookingCalendar from '@/features/booking/components/BookingCalendar';
import Contact from '@/features/landing/components/Contact';
import Footer from '@/shared/components/Footer';
import MobileCTA from '@/shared/components/MobileCTA';
import Animations from '@/shared/components/Animations';
import ThemeInit from '@/shared/components/ThemeInit';

import { createServerClient } from '@/shared/utils/supabase/server';

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
