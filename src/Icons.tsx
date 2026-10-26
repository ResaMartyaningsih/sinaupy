import type { SVGProps } from 'react'

export function IconBrand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" width="28" height="28" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="7" fill="#0f1f38" />
      {/* Subtle terminal chevron + pythonic underline */}
      <path d="M9 11l6 5-6 5" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21h6" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 17v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 15.5V17" />
      <circle cx="10" cy="6.5" r="3.5" />
    </svg>
  )
}

export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M14 16.5v-1a3 3 0 00-3-3H6a3 3 0 00-3 3v1" />
      <circle cx="8.5" cy="6.5" r="3" />
      <path d="M17 16.5v-1a3 3 0 00-2.2-2.9" />
      <path d="M13 3.6a3 3 0 010 5.8" />
    </svg>
  )
}

export function IconBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7.5 4.5a3 3 0 00-4 3 3 3 0 00.5 5.5V14a2 2 0 002 2h1.5v-4H6" />
      <path d="M12.5 4.5a3 3 0 014 3 3 3 0 01-.5 5.5V14a2 2 0 01-2 2H12.5v-4H14" />
      <path d="M10 3v14" />
    </svg>
  )
}

export function IconTrophy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 3h8v6a4 4 0 01-8 0V3z" />
      <path d="M4 5H2v2a3 3 0 003 3h1" />
      <path d="M16 5h2v2a3 3 0 01-3 3h-1" />
      <path d="M10 13v3" />
      <path d="M7 16h6" />
    </svg>
  )
}

export function IconBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3 4.5A2.5 2.5 0 015.5 2H10v14H5.5A2.5 2.5 0 003 18.5V4.5z" />
      <path d="M17 4.5A2.5 2.5 0 0014.5 2H10v14h4.5a2.5 2.5 0 012.5 2.5V4.5z" />
    </svg>
  )
}

export function IconTerminal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M6 7.5l3 2.5-3 2.5" />
      <path d="M11 12.5h3" />
    </svg>
  )
}

export function IconCode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6.5 6L3 10l3.5 4" />
      <path d="M13.5 6l3.5 4-3.5 4" />
      <path d="M11.5 4l-3 12" />
    </svg>
  )
}

export function IconPlay(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true" {...props}>
      <path d="M5.5 4.5v11l9-5.5-9-5.5z" />
    </svg>
  )
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10.5l4 4 8-8" />
    </svg>
  )
}

export function IconAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6.5v4" />
      <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  )
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M13.5 3.5l3 3L6 17H3v-3L13.5 3.5z" />
    </svg>
  )
}

export function IconSave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 3.5h9.5L16.5 6.5V16.5H4V3.5z" />
      <path d="M7 3.5v3h6v-3" />
      <path d="M6.5 12h7v4.5h-7V12z" />
    </svg>
  )
}

export function IconDownload(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10 3.5v9M6.5 9.5l3.5 3.5 3.5-3.5" />
      <path d="M3.5 15.5h13" />
    </svg>
  )
}

export function IconTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 5.5h12M7.5 5.5v-2h5v2M6 5.5l1 11h6l1-11" />
    </svg>
  )
}

export function IconPrinter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5.5 6.5V3h9v3.5M5.5 13.5H4A1.5 1.5 0 012.5 12v-3A1.5 1.5 0 014 7.5h12A1.5 1.5 0 0117.5 9v3a1.5 1.5 0 01-1.5 1.5h-1.5" />
      <rect x="5.5" y="11" width="9" height="6" rx="1" fill="#fff" stroke="currentColor" />
    </svg>
  )
}

export function IconCopy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="6.5" y="6.5" width="10" height="10" rx="1.5" />
      <path d="M4.5 13.5H4A1.5 1.5 0 012.5 12V4A1.5 1.5 0 014 2.5h8A1.5 1.5 0 0113.5 4v.5" />
    </svg>
  )
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

export function IconArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 10H4M9 15l-5-5 5-5" />
    </svg>
  )
}

export function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  )
}

export function IconChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

export function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}

export function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="13" height="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="4" y="9" width="12" height="8" rx="1.5" />
      <path d="M6.5 9V6a3.5 3.5 0 017 0v3" />
    </svg>
  )
}

export function IconCpu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="5" y="5" width="10" height="10" rx="2" />
      <path d="M9 1v4M11 1v4M9 15v4M11 15v4M1 9h4M1 11h4M15 9h4M15 11h4" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5L17 17" />
    </svg>
  )
}

export function IconCheckCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 5-5" />
    </svg>
  )
}

export function IconCrown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M2.5 15.5h15v2h-15v-2zm1.2-10l3.8 4.2 2.5-5.2 2.5 5.2 3.8-4.2 1.2 8h-15l1.2-8z" />
    </svg>
  )
}

export function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function IconArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 14L14 6M8 6h6v6" />
    </svg>
  )
}

export function IconCircleArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="#DCE6F2" fill="#FFFFFF" />
      <path d="M10 8l4 4-4 4" stroke="#315D9B" strokeWidth="2.2" />
    </svg>
  )
}

export function IconFilePdf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 2.5h8l4 4V17.5H4V2.5z" />
      <path d="M12 2.5v4h4" />
      <path d="M6 13h2a1.5 1.5 0 000-3H6v5" />
    </svg>
  )
}

export function IconFileWord(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" width="15" height="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 2.5h8l4 4V17.5H4V2.5z" />
      <path d="M12 2.5v4h4" />
      <path d="M6.5 10l1.2 4 1.3-3 1.3 3 1.2-4" />
    </svg>
  )
}

export function IconPythonLogo({ size = 80, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 110 110" width={size} height={size} fill="none" className={className} aria-hidden="true">
      {/* Blue Top Snake */}
      <path
        d="M54.2 10.5C31.5 10.5 33 20.3 33 20.3L33.1 30.5H54.5V33.6H23.8C14.6 33.6 7 39.2 7 51.5C7 63.8 15 63 15 63H21.2V54.3C21.2 44.2 29.8 44.4 29.8 44.4H50.5C60.2 44.4 60.8 35.8 60.8 35.8V19.7C60.8 19.7 61.9 10.5 54.2 10.5ZM43 17.5C45.2 17.5 47 19.3 47 21.5C47 23.7 45.2 25.5 43 25.5C40.8 25.5 39 23.7 39 21.5C39 19.3 40.8 17.5 43 17.5Z"
        fill="#315D9B"
      />
      {/* Yellow Bottom Snake */}
      <path
        d="M55.8 99.5C78.5 99.5 77 89.7 77 89.7L76.9 79.5H55.5V76.4H86.2C95.4 76.4 103 70.8 103 58.5C103 46.2 95 47 95 47H88.8V55.7C88.8 65.8 80.2 65.6 80.2 65.6H59.5C49.8 65.6 49.2 74.2 49.2 74.2V90.3C49.2 90.3 48.1 99.5 55.8 99.5ZM67 92.5C64.8 92.5 63 90.7 63 88.5C63 86.3 64.8 84.5 67 84.5C69.2 84.5 71 86.3 71 88.5C71 90.7 69.2 92.5 67 92.5Z"
        fill="#F4B544"
      />
    </svg>
  )
}



