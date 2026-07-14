const FDLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 gold-gradient flex items-center justify-center">
        <div className="flex justify-center ">
          <img
            src="/white_coroa.svg"
            alt="FD Store Logo"
            className="w-50 h-50 object-contain"
          />
        </div>
      </div>
      <div className="hidden md:block">
        <div className="font-display text-xl text-fd-gold">FD STORE</div>
      </div>
    </div>
  );
};

export default FDLogo;
