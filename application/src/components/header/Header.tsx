'use client';
import HeaderMobile from '@/components/header/HeaderMobile';
import useIsMobile from '@/hook/useIsMobile';
import HeaderDesktop from './HeaderDesktop';

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 bg-base-100 shadow-[0_3px_12px_rgba(0,0,0,0.25)] z-50">
      {isMobile ? <HeaderMobile/> : <HeaderDesktop/>}
    </div>
  );
}