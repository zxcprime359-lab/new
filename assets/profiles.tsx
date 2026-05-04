export function Profile1() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "#0D7E80" }}
    >
      <style>{`
        #left-brow { transform-origin: center 80%; animation: raise 10s ease-in-out infinite; }
        #sunglasses { transform-origin: center 100%; animation: tilt 10s 250ms ease infinite; }
        #mustache { transform-origin: center 90%; animation: mustache 10s ease infinite; }
        @keyframes raise { 0%,25%,100%{transform:translateY(0) rotate(0)} 10%,20%{transform:translateY(-10px) rotate(5deg)} }
        @keyframes tilt { 0%,25%,100%{transform:translateY(0) rotate(0)} 10%,20%{transform:translateY(-2px) rotate(5deg)} }
        @keyframes mustache { 0%,20%,40%,100%{transform:translateY(0) scale(1)} 30%{transform:translateY(4px) rotate(-3deg) scale(1.03)} }
      `}</style>
      <g fill="none" fillRule="evenodd">
        <g fill="#FCFDFF">
          <path
            d="M61 155l7-8h67c6.67 4 10 6.67 10 8 0 2 0-22-4-24s-67-2-78 1c-1.33 5.33-2 13-2 23z"
            id="mustache"
          />
          <path
            d="M94 77c-8.67 30-24.67 45-48 45-31 0-34-30-34-46 0-10.67 10-17 30-19h110c24.67 0 38 6 40 18 0 30-11.67 45.67-35 47-38 2-45-44-46-45-.67-.67-6.33-.67-17 0zM81 63c5.33 4.67 8 7.67 8 9h26c0-2 2.67-5 8-9H81z"
            id="sunglasses"
          />
          <path d="M111 35c1 5 4 13 4 14s45-13 70-2c-7-10-26-13-32-13-4 0-16 1-36 3-3.33-2-5.33-2.67-6-2z" />
          <path
            d="M89 38h-7c-12.67-6.67-24.33-10-35-10-10.67 0-20.67 3-30 9 9.33-1.33 16.33-1.67 21-1 9 1 31 7 44 15 3.33-1.33 5.67-5.67 7-13z"
            id="left-brow"
          />
        </g>
      </g>
    </svg>
  );
}
export function Profile2() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "#D15219" }}
    >
      <style>{`
        #left-pupil, #right-pupil { animation: side 10s ease-in-out infinite alternate; }
        #left-eye-top, #right-eye-top { transform-origin: center bottom; animation: wopen 10s ease-in-out infinite alternate; }
        #bottom-beak, #gillard { transform-origin: center top; animation: chew 20s ease-in-out infinite; }
        #hair { animation: hair 4s ease infinite alternate; }
        @keyframes side { 0%,45%{transform:translateX(0)} 5%,10%{transform:translateX(-5px)} 20%,25%{transform:translateX(5px)} 35%,40%{transform:translateX(-5px)} }
        @keyframes wopen { 0%,40%{opacity:0;transform:scale(1,0)} 42%,100%{opacity:1;transform:scale(1,1)} }
        @keyframes chew { 0%,4%,8%,12%,18%,80%,100%{transform:translateY(0) rotate(0)} 2%,6%,10%,14%{transform:translateY(3px) rotate(-3deg)} 26%,78%{transform:translateY(15px)} }
        @keyframes hair { 0%,100%{transform:scale(1)} 50%{transform:scale(1,.8)} }
      `}</style>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(13,0)">
          <path
            d="M7 0C3.67 4 2 7.33 2 10c0 4 4 8 8 8s16-5 18-8-4 9-4 14 3 11 11 11c21 0 21.05-35 67-35H7z"
            id="hair"
            fill="#FCFDFF"
          />
          <path
            d="M143 121c18.23 0 33-14.77 33-33h-66c0 18.23 14.77 33 33 33z"
            id="right-eye-bottom"
            fill="#FCFDFF"
          />
          <path
            d="M33 120c18.23 0 33-14.77 33-33H0c0 18.23 14.77 33 33 33z"
            id="left-eye-bottom"
            fill="#FCFDFF"
          />
          <path
            d="M143 56c18.23 0 33 14.77 33 33h-66c0-18.23 14.77-33 33-33z"
            id="right-eye-top"
            fill="#FCFDFF"
          />
          <path
            d="M33 55c18.23 0 33 14.77 33 33H0c0-18.23 14.77-33 33-33z"
            id="left-eye-top"
            fill="#FCFDFF"
          />
          <circle id="left-pupil" fill="#D15219" cx="32" cy="88" r="14" />
          <circle id="right-pupil" fill="#D15219" cx="142" cy="88" r="14" />
          <path
            d="M67 113c4.67-8.67 10.67-13 18-13s14 4.33 20 13H67z"
            id="top-beak"
            fill="#FCFDFF"
          />
          <path
            d="M99 117H72c2.67 6 7 9 13 9s10.67-3 14-9z"
            id="bottom-beak"
            fill="#FCFDFF"
          />
          <path
            d="M82 129c2.67.67 4.67 1 6 1s3.67-1 7-3c4 8 6 14.67 6 20 0 8-6 10-6 10s-6 1-7-6c-1.33 2-3.33 2.67-6 2-3.33-1.33-5-4.33-5-9s1.67-9.67 5-15z"
            id="gillard"
            fill="#FCFDFF"
          />
        </g>
      </g>
    </svg>
  );
}

export function Profile3() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="p3grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a7fd4" />
          <stop offset="100%" stopColor="#5bb8f5" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#p3grad)" />
      <g fill="none" fillRule="evenodd">
        <g fill="#FCFDFF">
          <g transform="translate(31,50)">
            <circle cx="12" cy="12" r="12" />
            <circle cx="123" cy="12" r="12" />
            <path d="M89.5 66.67c13.55 0 27.1-5.93 40.66-17.78 1.3-.53 2.58-.2 3.87 1 1.3 1.17 1.3 2.7 0 4.54C119.5 67.48 104.67 74 89.5 74c-15.17 0-30-6.52-44.53-19.56-1.3-1.85-1.3-3.37 0-4.55 1.3-1.2 2.58-1.53 3.87-1C62.4 60.73 75.94 66.66 89.5 66.66z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
export function Profile4() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#333]">
      <svg viewBox="0 0 100 100" width="80" height="80">
        <circle cx="50" cy="38" r="22" fill="#555" />
        <ellipse cx="50" cy="85" rx="32" ry="20" fill="#555" />
      </svg>
    </div>
  );
}
export function Profile5() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="p3grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="100%" stopColor="#f1645e" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#p3grad)" />
      <g fill="none" fillRule="evenodd">
        <g fill="#FCFDFF">
          <g transform="translate(31,50)">
            <circle cx="12" cy="12" r="12" />
            <circle cx="123" cy="12" r="12" />
            <path d="M89.5 66.67c13.55 0 27.1-5.93 40.66-17.78 1.3-.53 2.58-.2 3.87 1 1.3 1.17 1.3 2.7 0 4.54C119.5 67.48 104.67 74 89.5 74c-15.17 0-30-6.52-44.53-19.56-1.3-1.85-1.3-3.37 0-4.55 1.3-1.2 2.58-1.53 3.87-1C62.4 60.73 75.94 66.66 89.5 66.66z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
