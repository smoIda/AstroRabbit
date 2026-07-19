import React from "react";

import Link from "next/link";

import { BracketGroup } from "@/components/ui/decoration/bracket";

import { cn } from "@/lib/utils/cn";

type CommonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

type NativeButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
    ref?: React.Ref<HTMLButtonElement>;
  };

type InternalLinkProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, "children" | "className" | "ref"> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type ExternalLinkProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type ButtonProps = NativeButtonProps | InternalLinkProps | ExternalLinkProps;

const isExternalLink = (href: string) =>
  /^(https?:\/\/|\/\/|mailto:|tel:|ftp:|sms:)/.test(href);

const variants = {
  default: "",
  "no-brackets": "",
} as const;

const sizes = {
  sm: "h-8 px-2 text-sm w-fit",
  md: "h-10 px-3 text-base w-fit",
  lg: "h-12 px-4 text-lg w-fit",
  icon: "size-8 text-xl p-0",
} as const;

function getSharedProps<T extends ButtonProps>(props: T) {
  const {
    children,
    variant = "default",
    size = "sm",
    className,
    ...rest
  } = props;

  const classes = cn(
    "text-ink gap-x-2 disabled:text-ink-soft relative inline-flex cursor-pointer items-center justify-center disabled:cursor-not-allowed",
    sizes[size],
    variants[variant],
    className,
  );

  const content = (
    <>
      {children}
      <BracketGroup />
    </>
  );

  return { classes, content, rest };
}

function validateProps(props: ButtonProps) {
  if (process.env.NODE_ENV === "production") return;

  if (props.size === "icon" && React.Children.count(props.children) !== 1) {
    console.warn('Button with size="icon" should contain a single icon.');
  }

  if (
    props.size === "icon" &&
    !("aria-label" in props && props["aria-label"]) &&
    !("aria-labelledby" in props && props["aria-labelledby"])
  ) {
    console.warn(
      'Button with size="icon" should have an aria-label (or aria-labelledby) for accessibility.',
    );
  }
}

function renderButton(props: NativeButtonProps) {
  const { classes, content, rest } = getSharedProps(props);
  const { ref, type, ...buttonProps } = rest;

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type ?? "button"}
      className={classes}
    >
      {content}
    </button>
  );
}

function renderInternalLink(props: InternalLinkProps) {
  const { classes, content, rest } = getSharedProps(props);
  const { ref, href, ...linkProps } = rest;

  return (
    <Link {...linkProps} ref={ref} href={href} className={classes}>
      {content}
    </Link>
  );
}

function renderExternalLink(props: ExternalLinkProps) {
  const { classes, content, rest } = getSharedProps(props);
  const { ref, href, target, rel, ...linkProps } = rest;

  return (
    <a
      {...linkProps}
      ref={ref}
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={classes}
    >
      {content}
    </a>
  );
}

export function Button(props: ButtonProps) {
  validateProps(props);

  if (props.href === undefined) return renderButton(props);

  if (isExternalLink(props.href)) return renderExternalLink(props);

  return renderInternalLink(props);
}
