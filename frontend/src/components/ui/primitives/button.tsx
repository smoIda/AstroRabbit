"use client"

import React from "react";

import Link from "next/link";

import { BracketGroup } from "@/components/ui/decorations/bracket";

import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const isExternalLink = (href: string) =>
  /^(https?:\/\/|\/\/|mailto:|tel:|ftp:|sms:)/.test(href);

const hoverInsetStyles = {
  sm: "group-hover:inset-px group-active:inset-0.5",
  md: "group-hover:inset-0.5 group-active:inset-1",
  lg: "group-hover:inset-0.75 group-active:inset-1.25",
} as const;

const styles = cva(
  [
    "text-ink gap-x-2 relative w-fit inline-flex cursor-pointer items-center justify-center",
    "disabled:text-ink-soft disabled:cursor-not-allowed",
  ],

  {
    variants: {
      variant: {
        normal: "group",
        static: "",
        "no-brackets": "",
      },

      size: {
        sm: "h-8 px-2 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
        icon: "size-8 text-xl p-0",
      },
    },

    defaultVariants: {
      variant: "normal",
      size: "sm",
    },
  },
);

type CommonProps = VariantProps<typeof styles> & {
  children: React.ReactNode;
  className?: string;
  hoverInset?: keyof typeof hoverInsetStyles;
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

function getSharedProps<T extends ButtonProps>(props: T) {
  const { children, variant, size, hoverInset, className, ...rest } = props;

  const safeSize = !size || size === "icon" ? "sm" : size;

  const classes = cn(styles({ variant, size, className }));

  const content = (
    <>
      {children}
      {variant !== "no-brackets" && (
        <div
          className={cn(
            "absolute inset-0 transition-[inset] duration-100",
            hoverInsetStyles[hoverInset ?? safeSize],
          )}
        >
          <BracketGroup size={safeSize} />
        </div>
      )}
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
