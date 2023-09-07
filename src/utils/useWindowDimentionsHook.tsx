import { useState, useEffect } from 'react';

type WindowDimentions= {
  width: number;
  heigth: number
}

export const useWindowDimentions = (): WindowDimentions => {
  const [windowDimentions, setWindowDimentions] = useState<WindowDimentions>({width: 0, heigth: 0});

  useEffect (()=> {
    const handleResize = ():void => {
      setWindowDimentions({
        width: window.innerWidth,
        heigth: window.innerHeight,
      })
    };
    handleResize();
    window.addEventListener('resize', handleResize)
    return ():void => window.removeEventListener('resize', handleResize);
  },[])
  return windowDimentions
}