/** Renders one or more schema.org JSON-LD objects in a script tag.
 *  `<` is escaped so the serialized JSON can never break out of the script. */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
