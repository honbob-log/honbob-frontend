import type React from "react"

interface IconProps {
  className?: string
}

export const KakaoIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.272C6.26 2.272 1.5 5.99 1.5 10.48C1.5 13.225 3.13 15.662 5.67 17.132C5.41 18.034 4.92 20.052 4.75 20.79C4.53 21.723 5.09 21.718 5.51 21.443C5.84 21.221 8.31 19.553 9.39 18.805C10.23 18.965 11.1 19.05 12 19.05C17.74 19.05 22.5 15.332 22.5 10.842C22.5 6.352 17.74 2.272 12 2.272Z"
        fill="#371D1E"
      />
    </svg>
  )
}

export const NaverIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M16.273 12.845L7.376 0H0V24H7.727V11.155L16.624 24H24V0H16.273V12.845Z" fill="white" />
    </svg>
  )
}
