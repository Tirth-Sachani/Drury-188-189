const Marquee = ({ text }: { text: string }) => {
  return (
    <div className="bg-roast py-12 overflow-hidden whitespace-nowrap border-y border-crema/10">
      <div className="animate-marquee inline-block">
        {[...Array(10)].map((_, i) => (
          <span 
            key={i} 
            className="serif italic text-6xl md:text-8xl text-napkin/20 mx-12 uppercase tracking-tighter"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
