import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // スムーススクロールの設定
    let scrollPosition = 0;
    let targetScrollPosition = 0;
    const smoothness = 0.1;

    // bodyにスムーススクロール用のラッパーを作成
    const wrapper = document.querySelector('#smooth-wrapper') as HTMLElement;
    const content = document.querySelector('#smooth-content') as HTMLElement;

    if (!wrapper || !content) return;

    // コンテンツの高さを取得してbodyの高さを設定
    const setBodyHeight = () => {
      document.body.style.height = `${content.offsetHeight}px`;
    };
    setBodyHeight();

    // スムーススクロールアニメーション
    const smoothScroll = () => {
      targetScrollPosition = window.scrollY;
      scrollPosition += (targetScrollPosition - scrollPosition) * smoothness;
      
      gsap.set(content, {
        y: -scrollPosition,
      });

      requestAnimationFrame(smoothScroll);
    };

    smoothScroll();

    // ResizeObserverでコンテンツサイズの変更を監視
    const resizeObserver = new ResizeObserver(() => {
      setBodyHeight();
      ScrollTrigger.refresh();
    });
    
    resizeObserver.observe(content);

    // ウィンドウリサイズ時にも更新
    const handleResize = () => {
      setBodyHeight();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      document.body.style.height = '';
    };
  }, []);

  return null;
}
