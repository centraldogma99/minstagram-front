import { useState, useCallback, useEffect } from "react";

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [show, setShow] = useState<boolean>(false);

  const handleContext = useCallback((e) => {
    e.preventDefault();
    setAnchorPoint({ x: e.pageX, y: e.pageY });
    setShow(true);
  }, [setAnchorPoint, setShow])

  const handleOutsideClick = useCallback(() =>
    show ? setShow(false) : null,
    [show])

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  })

  return { show, anchorPoint, handleContext }
}

export default useContextMenu;