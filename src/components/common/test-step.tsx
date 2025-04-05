const TestStep = ({
  number,
  title,
  subtitle,
  first = false,
  last = false,
}: {
  number: string;
  title: string;
  subtitle: string;
  first?: boolean;
  last?: boolean;
}) => {
  return (
    <div className="flex grow items-center gap-4 pr-4">
      <div className="relative px-8 py-8 text-center text-white">
        <div className={` ${first ? "" : "lg:ml-[20%] lg:w-[120%]"} `}>
          <p className="relative z-10 font-light">step</p>
          <p className="relative z-10 text-4xl font-black">{number}</p>
        </div>
        <div className="absolute -right-[20%] bottom-0 left-0 z-0 hidden h-full lg:block">
          <div
            style={{
              clipPath: first
                ? "polygon(-1% 0%, 0% 100%, 80% 100% , 100% 50% , 80% 0% )"
                : "polygon(-1% 0%, 20% 50% ,-1% 100% , 80% 100% , 100% 50% , 80% 0% )",
            }}
            className="from-teal-500 relative h-full w-full bg-gradient-to-br to-primary-600"
          ></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-0 h-full w-full lg:hidden">
          <div
            className="from-teal-500 relative h-full w-full bg-gradient-to-br to-primary-600"
            style={{
              clipPath: first
                ? "polygon(0% 0%, 0% 85% , 50% 95%, 100% 85%, 100% 0% )"
                : last
                  ? "polygon(0% 0%, 0% 100% , 100% 100%, 100% 0% , 50% 10% )"
                  : "polygon(0% 0%, 0% 85% , 50% 95%, 100% 85%, 100% 0% , 50% 10% )",
            }}
          />
        </div>
      </div>
      <div className="pl-4 text-left">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-light">{subtitle}</p>
      </div>
    </div>
  );
};

export default TestStep;
