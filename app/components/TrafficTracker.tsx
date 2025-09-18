"use client";
import { useEffect } from "react";

export default function TrafficTracker() {
  useEffect(() => {
    // 개발 모드에서는 트래픽 추적 비활성화
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    
    fetch("/api/admin/traffic", { method: "POST" });
  }, []);
  return null;
} 