function LoadingSpinner() {
  return (
    <div className="max-h-[200px] flex justify-center absolute w-full mt-6">
      <img
        src="../public/images/loading-spinner.png"
        className="animate-spin w-[200px] h-[200px]"
        alt="Loading spinner img"
      />
    </div>
  );
}

export default LoadingSpinner;
