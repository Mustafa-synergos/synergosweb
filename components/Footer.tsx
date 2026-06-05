import Link from 'next/link';
import Image from 'next/image';
import InteractiveDots from './InteractiveDots';
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className="relative bg-[#111111] text-white overflow-hidden">
      {/* Interactive Dots Background */}
      <InteractiveDots variant="footer" />

      <div className="relative z-10 px-4 sm:px-8 py-14 sm:py-14">
        {/* Logo - centered at top */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="relative w-[188px] h-[24px] sm:w-[254px] sm:h-[33.13px] mx-auto">
            <Image
              src="/images/synergos-logo-foder.png"
              alt="Synergos Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Four columns - exact spacing */}
        <div className="grid grid-cols-1 md:grid-cols-1
         lg:grid-cols-[0.8fr_0.7fr_1.4fr_0.7fr] gap-x-4 sm:gap-x-2 gap-y-6 sm:gap-y-8 mb-12 sm:mb-20 mx-auto" style={{ maxWidth: '100%' }}>
          {/* OFFICE LOCATION */}
          <div>
            <h3 className="font-[clother] font-normal not-italic text-[18px] sm:text-[22px] leading-[100%] tracking-normal text-white/90 mb-4 sm:mb-6 uppercase">OFFICE LOCATION</h3>
            <p className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400">
              Synergos Tech Consulting Services Pvt. Ltd<br />
              11/1, Krishna Road, Basavanagudi,<br />
              Bangalore - 560 004.<br />
              India
            </p>
          </div>

          {/* BROWSE */}
          <div>
            <h3 className="font-[clother] font-normal not-italic text-[18px] sm:text-[22px] leading-[100%] tracking-normal text-white/90 mb-4 sm:mb-6 uppercase">BROWSE</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="space-y-3">
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Who we are</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">What we offer</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Our work</Link></div>
              </div>
              <div className="space-y-3">
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Resources</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Career</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Contact us</Link></div>
              </div>
            </div>
          </div>

          {/* WHAT WE OFFER */}
          <div>
            <h3 className="font-[clother] font-normal not-italic text-[18px] sm:text-[22px] leading-[100%] tracking-normal text-white/90 mb-4 sm:mb-6 uppercase">WHAT WE OFFER</h3>
            <div className="grid grid-cols-2
             sm:grid-cols-1 md:grid-cols-2
            gap-x-4 gap-y-3">
              <div className="space-y-3">
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Strategy & Research</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Storytelling & Performance</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Digital Marketing & Performance</Link></div>
              </div>
              <div className="space-y-3">
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Web & App Development</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Brand films & Production</Link></div>
                <div><Link href="#" className="font-[clother] font-light not-italic text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] tracking-normal text-gray-400 hover:text-white transition-colors duration-300 whitespace-nowrap">Offline & OOH</Link></div>
              </div>
            </div>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="font-[clother] font-normal not-italic text-[18px] sm:text-[22px] leading-[100%] tracking-normal text-white/90 mb-4 sm:mb-6 uppercase">CONNECT</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
  <div className="space-y-3">

    {/* Linkedin */}
    <div>
      <Link
        href="#"
        className="group inline-flex items-center gap-2 overflow-hidden"
      >
        {/* Icon - appears from left on hover */}
        <span className="flex w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:w-5 group-hover:opacity-100 !mb-0 lg:!mb-2">
          <span className="text-[18px] text-red-500 !mb-0 lg:!mb-2">
            <FaLinkedinIn />
          </span>
        </span>

        {/* Text Animation - slides left on hover */}
        <span className="relative w-[max-content] overflow-hidden !mb-0 lg:!mb-2">
          <span className="block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-gray-400 transition-all duration-500 group-hover:-translate-x-full whitespace-nowrap !mb-0 lg:!mb-2">
            Linkedin
          </span>

          <span className="absolute -left-full top-0 block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-red-500 transition-all duration-500 group-hover:left-0 whitespace-nowrap !mb-0 lg:!mb-2">
            Linkedin
          </span>
        </span>
      </Link>
    </div>

    {/* Facebook */}
    <div>
      <Link
        href="#"
        className="group inline-flex items-center gap-2 overflow-hidden"
      >
        {/* Icon - appears from left on hover */}
        <span className="flex w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:w-5 group-hover:opacity-100 !mb-0 lg:!mb-2">
          <span className="text-[18px] text-red-500 !mb-0 lg:!mb-2">
            <FaFacebookF />
          </span>
        </span>

        {/* Text Animation - slides left on hover */}
        <span className="relative w-[max-content] overflow-hidden !mb-0 lg:!mb-2">
          <span className="block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-gray-400 transition-all duration-500 group-hover:-translate-x-full whitespace-nowrap !mb-0 lg:!mb-2">
            Facebook
          </span>

          <span className="absolute -left-full top-0 block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-red-500 transition-all duration-500 group-hover:left-0 whitespace-nowrap !mb-0 lg:!mb-2">
            Facebook
          </span>
        </span>
      </Link>
    </div>

  </div>

  <div className="space-y-3">

    {/* Instagram */}
    <div>
      <Link
        href="#"
        className="group inline-flex items-center gap-2 overflow-hidden"
      >
        {/* Icon - appears from left on hover */}
        <span className="flex w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:w-5 group-hover:opacity-100 !mb-0 lg:!mb-2">
          <span className="text-[18px] text-red-500 !mb-0 lg:!mb-2">
            <FaInstagram />
          </span>
        </span>

        {/* Text Animation - slides left on hover */}
        <span className="relative w-[max-content] overflow-hidden !mb-0 lg:!mb-2">
          <span className="block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-gray-400 transition-all duration-500 group-hover:-translate-x-full whitespace-nowrap !mb-0 lg:!mb-2">
            Instagram
          </span>

          <span className="absolute -left-full top-0 block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-red-500 transition-all duration-500 group-hover:left-0 whitespace-nowrap !mb-0 lg:!mb-2">
            Instagram
          </span>
        </span>
      </Link>
    </div>

    {/* X */}
    <div>
      <Link
        href="#"
        className="group inline-flex items-center gap-2 overflow-hidden"
      >
        {/* Icon - appears from left on hover */}
        <span className="flex w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:w-5 group-hover:opacity-100 !mb-0 lg:!mb-2">
          <span className="text-[18px] text-red-500 !mb-0 lg:!mb-2">
            <FaXTwitter />
          </span>
        </span>

        {/* Text Animation - slides left on hover */}
        <span className="relative w-[max-content] overflow-hidden !mb-0 lg:!mb-2">
          <span className="block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-gray-400 transition-all duration-500 group-hover:-translate-x-full whitespace-nowrap !mb-0 lg:!mb-2">
            X
          </span>

          <span className="absolute -left-full top-0 block font-[clother] font-light text-[16px] sm:text-[18px] leading-[22px] sm:leading-[26px] text-red-500 transition-all duration-500 group-hover:left-0 whitespace-nowrap !mb-0 lg:!mb-2">
            X
          </span>
        </span>
      </Link>
    </div>

  </div>
</div>
          </div>
        </div>

        {/* Bottom section with border */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mx-auto text-left" style={{ maxWidth: '100%' }}>
            {/* Copyright */}
            <div className="font-[clother] font-light not-italic text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] tracking-normal text-gray-400">
              ©2026 SYNERGOS Tech Consulting Services Pvt Ltd. All Rights Reserved.
            </div>

            {/* Privacy Policy & T&C */}
            <div className="font-[clother] font-light not-italic text-[14px] sm:text-[18px] leading-[20px] sm:leading-[26px] tracking-normal text-gray-400">
              <Link href="#" className="text-gray-400 hover:text-[#FF0000] active:text-white transition-colors duration-300">Privacy Policy</Link> | <Link href="#" className="text-gray-400 hover:text-[#FF0000] active:text-white transition-colors duration-300">T&C</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements - exact positioning */}
      <div className="hidden lg:block absolute bottom-0 right-[15rem] w-[30rem] h-[30rem] opacity-50">
        <img
          src="/images/foter-vector.webp"
          alt="Decorative element"
          className="w-full h-full object-contain"
        />
      </div>
      {/* <div className="hidden lg:block absolute top-32 right-24 w-2 h-2 bg-white/30 rounded-full"></div> */}
            {/* <div className="hidden lg:block absolute bottom-40 left-24 w-1.5 h-1.5 bg-white/25 rounded-full"></div> */}
    </footer>
  );
}
