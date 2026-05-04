"use client";

import {
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" text-gray-300 py-8 px-4 w-full text-xs lg:text-base lg:mb-0 mb-15">
      <div className=" text-center flex flex-col items-center justify-center mt-8 ">
        <div className="mb-6 flex gap-8">
          <a
            href="https://www.facebook.com/profile.php?id=61567135169478"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-800 text-[#3b5998]"
          >
            <IconBrandFacebook size={24} />
          </a>
          <a href="#" className="hover:text-red-800 text-[#1da1f2]">
            <IconBrandTwitter size={24} />
          </a>
          <a href="#" className="hover:text-red-800 text-[#0088cc]">
            <IconBrandTelegram size={24} />
          </a>
          <a href="#" className="hover:text-red-800 text-[#ff0000]">
            <IconBrandYoutube size={24} />
          </a>
        </div>
        <nav className="mb-5 w-full flex justify-center flex-wrap gap-5">
          <a
            href="https://www.zxcstream.icu/#company/2949"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Shudder
          </a>
          <a
            href="https://www.zxcstream.icu/#company/213"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Netflix
          </a>
          <a
            href="https://www.zxcstream.icu/#company/1024"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Prime Video
          </a>
          <a
            href="https://www.zxcstream.icu/#company/2739"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Disney+
          </a>
          <a
            href="https://www.zxcstream.icu/#company/453"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Hulu
          </a>
          <a
            href="https://www.zxcstream.icu/#company/3186"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Max
          </a>
          <a
            href="https://www.zxcstream.icu/#company/2552"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Apple TV+
          </a>
          <a
            href="https://www.zxcstream.icu/#company/4330"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Paramount+
          </a>
          <a
            href="https://www.zxcstream.icu/#company/3353"
            className=" hover:text-red-800 font-medium transition-colors"
          >
            Peacock
          </a>
        </nav>

        <p className="leading-relaxed mt-4 mb-4 max-w-[900px] px-2">
          <strong className="text-red-600">ZXC[STREAM]</strong> does not host
          any files, it merely pulls streams from 3rd party services. Legal
          issues should be taken up with the file hosts and providers.{" "}
          <strong className="text-red-600">ZXC[STREAM]</strong> is not
          responsible for any media files shown by the video providers.
        </p>

        <p className="text-white/50">
          © {currentYear} ZXC[STREAM] All rights reserved.
        </p>
      </div>
    </footer>
  );
}
