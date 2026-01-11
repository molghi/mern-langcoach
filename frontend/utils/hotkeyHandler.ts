const hotkeyHandler = (
  e: KeyboardEvent,
  activeTab: number,
  setActiveTab: React.Dispatch<React.SetStateAction<number>>,
  isOnFirstPage: boolean,
  isOnLastPage: boolean,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  if (e.ctrlKey && e.code === "Digit1") {
    // switch to Tab 1
    setActiveTab(0);
  }

  if (e.ctrlKey && e.code === "Digit2") {
    // switch to Tab 2
    setActiveTab(1);
  }

  if (e.ctrlKey && e.code === "Digit3") {
    // switch to Tab 3
    setActiveTab(2);
  }

  // ============================================================================

  if (activeTab === 1 && e.code === "ArrowLeft") {
    // paginate prev
    if (isOnFirstPage === false) {
      console.log(`paginate prev`);
      setCurrentPage((prev) => prev - 1);
    }
  }

  if (activeTab === 1 && e.code === "ArrowRight") {
    // paginate next
    if (isOnLastPage === false) {
      console.log(`paginate next`);
      setCurrentPage((prev) => prev + 1);
    }
  }
};

export default hotkeyHandler;
