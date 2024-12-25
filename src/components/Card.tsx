import Datetime from "./Datetime";
import type { BlogFrontmatter } from "@content/_schemas";

export interface Props {
  href?: string;
  frontmatter: BlogFrontmatter;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, tags } = frontmatter;
  return (
    <li className="my-4">
      <article className="group relative rounded-lg bg-skin-card/30 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-skin-card/50">
        <a href={href} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Datetime
              datetime={pubDatetime}
              className="text-xs text-skin-base/70"
            />
            {tags && tags[0] && (
              <span className="rounded-full bg-skin-card/50 px-2 py-0.5 text-xs text-skin-base/60">
                {tags[0]}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {secHeading ? (
              <h2 className="text-lg font-medium text-skin-base transition-colors duration-200 group-hover:text-skin-accent">
                {title}
              </h2>
            ) : (
              <h3 className="text-lg font-medium text-skin-base transition-colors duration-200 group-hover:text-skin-accent">
                {title}
              </h3>
            )}
            <p className="line-clamp-2 text-sm leading-relaxed text-skin-base/70">
              {description}
            </p>
          </div>

          <div className="mt-1">
            <span className="text-xs font-medium text-skin-accent/90 transition-colors duration-200 group-hover:text-skin-accent">
              Read article →
            </span>
          </div>
        </a>
      </article>
    </li>
  );
}
