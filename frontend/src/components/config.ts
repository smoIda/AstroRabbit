export const links: Link[] = [
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

export type Link = {
  id: "ASTRO RABBIT" | "DOCUMENTS" | "PROJECTS";
  path: "/" | "/docs" | "/projects";
};

/* ------------------------------------------------------ */

export const excludePath = "/dashboard";

/* ------------------------------------------------------ */
