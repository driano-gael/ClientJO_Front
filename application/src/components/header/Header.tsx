'use client';
import HeaderMobile from '@/components/header/HeaderMobile';
import useIsMobile from '@/hook/useIsMobile';
import HeaderDesktop from './HeaderDesktop';

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <HeaderMobile/> : <HeaderDesktop/>}
    </div>
  );
}