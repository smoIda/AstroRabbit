type SectionProps = {
  ref?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
};

export function Section({ ref, children, ...props }: SectionProps) {
  return (
    <section
      ref={ref}
      className="pointer-events-auto! relative flex size-full items-center justify-center p-4"
      {...props}
    >
      {children}
    </section>
  );
}
