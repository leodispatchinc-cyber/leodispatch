/* ============================================================
   LEO DISPATCH — Service-area state pages
   Real, verifiable freight-corridor context per state (interstates,
   hub cities, ports) — gives each /dispatch/[state] page genuinely
   unique content instead of a templated city-name swap.
   ============================================================ */

export interface DispatchState {
  slug: string;
  name: string;
  abbr: string;
  /** Interstate corridors that run through this state */
  corridors: string[];
  /** Freight hub cities / ports in this state */
  hubs: string[];
  /** One line on why this state matters for freight (public geography fact, not a company stat) */
  context: string;
}

export const dispatchStates: DispatchState[] = [
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    corridors: ["I-35", "I-45", "I-20", "I-10"],
    hubs: ["Dallas–Fort Worth", "Houston", "San Antonio", "Laredo"],
    context:
      "the largest inland freight market in the country, with Laredo handling more cross-border truck freight than any other US port of entry",
  },
  {
    slug: "california",
    name: "California",
    abbr: "CA",
    corridors: ["I-5", "I-10", "I-15", "I-210"],
    hubs: ["Los Angeles", "Long Beach", "Inland Empire", "Oakland"],
    context:
      "home to the Ports of Los Angeles and Long Beach, the busiest container gateway in the United States",
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    corridors: ["I-75", "I-85", "I-20", "I-16"],
    hubs: ["Atlanta", "Savannah"],
    context:
      "anchored by the Port of Savannah, one of the fastest-growing container ports in the country, and Atlanta's interstate crossroads",
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbr: "IL",
    corridors: ["I-80", "I-90", "I-55", "I-94"],
    hubs: ["Chicago", "Joliet"],
    context:
      "built around Chicago, the largest rail and intermodal freight hub in North America",
  },
  {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    corridors: ["I-95", "I-75", "I-4", "I-10"],
    hubs: ["Miami", "Jacksonville", "Orlando", "Tampa"],
    context:
      "a top import and produce corridor, with JAXPORT and the I-4 corridor moving freight between Florida's coasts",
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbr: "OH",
    corridors: ["I-70", "I-71", "I-75", "I-80"],
    hubs: ["Columbus", "Cincinnati", "Cleveland"],
    context:
      "within a day's drive of roughly 60% of the US and Canadian population, making it one of the country's busiest freight crossroads",
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbr: "PA",
    corridors: ["I-76", "I-81", "I-78", "I-95"],
    hubs: ["Philadelphia", "Harrisburg", "Lehigh Valley"],
    context:
      "a major East Coast distribution hub linking the Port of Philadelphia to the I-81 corridor",
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    corridors: ["I-85", "I-40", "I-95", "I-77"],
    hubs: ["Charlotte", "Raleigh", "Greensboro"],
    context: "one of the fastest-growing logistics and distribution hubs in the Southeast",
  },
];

export function getDispatchState(slug: string) {
  return dispatchStates.find((s) => s.slug === slug);
}
