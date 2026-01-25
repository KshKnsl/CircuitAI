"use client"

import { useEffect, useState } from "react"

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the standard md breakpoint in Tailwind
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function useDeviceType(): { isMobile: boolean, isTablet: boolean } {
  const [deviceType, setDeviceType] = useState({ 
    isMobile: false, 
    isTablet: false 
  })

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width <= 1024
      })
    }
    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)
    return () => window.removeEventListener("resize", checkDeviceType)
  }, [])

  return deviceType
}
