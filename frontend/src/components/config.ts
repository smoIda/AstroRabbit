export const links: LinkProps[] = [
  {
    id: "ASTRO RABBIT",
    path: "/",
  },

  {
    id: "DOCUMENTS",
    path: "/docs",
  },

  {
    id: "PROJECTS",
    path: "/projects",
  },
] as const;

export type LinkProps = {
  id: "ASTRO RABBIT" | "DOCUMENTS" | "PROJECTS";
  path: "/" | "/docs" | "/projects";
};

/* ------------------------------------------------------ */

export const excludePath = "/dashboard";

/* ------------------------------------------------------ */
