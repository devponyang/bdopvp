// 테이블 형태의 입력 필드에서 키보드 방향키로 이동할 수 있는 훅
'use client';

import { useEffect, useRef } from 'react';

interface UseKeyboardNavigationProps {
  rows: number;
  cols: number;
  disabled?: boolean;
}

export const useKeyboardNavigation = ({ rows, cols, disabled = false }: UseKeyboardNavigationProps) => {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      
      // input 요소가 아니면 무시
      if (!target || target.tagName !== 'INPUT') return;
      
      // 테이블 내의 input이 아니면 무시
      if (!tableRef.current?.contains(target)) return;

      const inputs = Array.from(tableRef.current.querySelectorAll('input')) as HTMLInputElement[];
      const currentIndex = inputs.indexOf(target);
      
      if (currentIndex === -1) return;

      let nextIndex = -1;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = currentIndex - cols;
          if (nextIndex >= 0) {
            inputs[nextIndex].focus();
            inputs[nextIndex].select();
          }
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = currentIndex + cols;
          if (nextIndex < inputs.length) {
            inputs[nextIndex].focus();
            inputs[nextIndex].select();
          }
          break;
          
        case 'ArrowLeft':
          // 커서가 맨 앞에 있을 때만 이전 필드로 이동
          if (target.selectionStart === 0) {
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex >= 0) {
              inputs[nextIndex].focus();
              inputs[nextIndex].select();
            }
          }
          break;
          
        case 'ArrowRight':
          // 커서가 맨 뒤에 있을 때만 다음 필드로 이동
          if (target.selectionStart === target.value.length) {
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex < inputs.length) {
              inputs[nextIndex].focus();
              inputs[nextIndex].select();
            }
          }
          break;
          
        case 'Enter':
          e.preventDefault();
          // Enter는 다음 행의 같은 열로 이동
          nextIndex = currentIndex + cols;
          if (nextIndex < inputs.length) {
            inputs[nextIndex].focus();
            inputs[nextIndex].select();
          }
          break;
          
        case 'Tab':
          // Tab의 기본 동작은 유지하되, Shift+Tab도 처리
          if (e.shiftKey) {
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex >= 0) {
              inputs[nextIndex].focus();
              inputs[nextIndex].select();
            }
          } else {
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex < inputs.length) {
              inputs[nextIndex].focus();
              inputs[nextIndex].select();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [rows, cols, disabled]);

  return tableRef;
};

