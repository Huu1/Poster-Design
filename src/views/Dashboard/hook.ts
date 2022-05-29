import { useEffect } from "react";

export const useMutationObserver = (
  fn: () => void,
  domId = "memu-side-bar"
) => {
  useEffect(() => {
    const observerSideDom = () => {
      const config = { attributes: true };
      const callback = function () {
        fn();
      };
      // 创建一个观察器实例并传入回调函数
      const observer = new MutationObserver(callback);
      // 以上述配置开始观察目标节点
      observer.observe(document.getElementById(domId) as HTMLElement, config);
      return observer;
    };
    const observer = observerSideDom();

    return () => observer?.disconnect();
  }, []);
};

export const useWindowResize = (fn: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", fn);
    fn();
    return () => {
      window.removeEventListener("resize", fn);
    };
  }, []);
};
