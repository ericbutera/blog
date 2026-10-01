import { icon, type IconDefinition } from "@fortawesome/fontawesome-svg-core";

const iconHtmlByDefinition = new WeakMap<IconDefinition, string>();

export function iconHtml(iconDefinition: IconDefinition): string {
  const cachedIconHtml = iconHtmlByDefinition.get(iconDefinition);
  if (cachedIconHtml) {
    return cachedIconHtml;
  }

  const renderedIconHtml = icon(iconDefinition).html.join("");
  iconHtmlByDefinition.set(iconDefinition, renderedIconHtml);
  return renderedIconHtml;
}
