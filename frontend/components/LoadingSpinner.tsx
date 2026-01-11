function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-6">
      <img
        src="../public/images/loading-spinner.png"
        className="animate-spin w-[200px] h-[200px]"
        alt="Loading spinner img"
      />
    </div>
  );
}

export default LoadingSpinner;
