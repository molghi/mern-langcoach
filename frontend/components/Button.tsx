interface Props {
  children: string; // aka slot, content
  className?: string;
  title?: string;
  style?: Record<string, string>; // obj of key-value pairs
  type?: "submit"; // can only be 'submit'
  onClick?: () => void; // () => void   means a generic fn returning void (= just a fn signature)
}

function Button(props: Props) {
  const { children, className, onClick, type, style, title } = props;

  return (
    <button
      type={type || "button"}
      title={title}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition duration-200 border border-gray-600 text-[antiquewhite] ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
