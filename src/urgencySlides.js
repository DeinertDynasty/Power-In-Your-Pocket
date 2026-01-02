// src/urgencySlides.js
// Static urgency deck (no Quizlet dependency)

const slides = [
  { title: "Window Anatomy (Full Pic)", body: "Image / diagram reference." },

  { title: "Jamb", body: "The frame around the sash that fits into the rough opening in the wall; the vertical side of a window surround." },
  { title: "Sash", body: "Holds the glass in a window." },
  { title: "Casing", body: "Surrounds the jamb and covers the gap between the window and the framing (inside and out)." },
  { title: "Sill", body: "The horizontal bottom portion of a window; usually sloped away to shed water." },
  { title: "Mullion", body: "The structural piece between two sashes (horizontal or vertical)." },
  { title: "Lights", body: "Individual panes of glass." },
  { title: "Muntins", body: "Small vertical or horizontal bars between small lights of glass in a sash." },

  { title: "Prime window", body: "A window permanently installed in a building." },
  { title: "Storm window", body: "A removable unit added seasonally to a prime window to improve thermal performance." },
  { title: "Combination window", body: "A unit incorporating both glass and insect screening; glass portion can be opened in summer for ventilation through screening." },
  { title: "Replacement window", body: "Windows designed to install easily in openings left by deteriorated windows removed from older buildings." },

  { title: "Fixed window", body: "Doesn’t move; least expensive and least likely to leak air or water." },
  { title: "Single-hung and double-hung window", body: "Have one or two moving sashes that slide up and down in tracks in the frame." },
  { title: "Sliding window", body: "A single-hung window turned on its side." },
  { title: "Projected windows", body: "Sashes rotate outward; must resist wind loads while supporting their weight at only two corners; can open to full area." },
  { title: "Casement windows", body: "Narrow in width; can be joined to one another." },
  { title: "Awning windows", body: "Can be broad but not usually very tall; protect the opening from falling rain." },

  {
    title: "Wood (window construction)",
    body:
      "Traditional frames/sashes; good insulator.\n" +
      "Shrinks/swells with moisture; requires repainting; subject to decay.\n" +
      "Knot-free wood is increasingly rare and expensive."
  },
  {
    title: "Vinyl (window construction)",
    body:
      "Increasing in popularity in residential construction; fairly good insulator.\n" +
      "Never needs painting; PVC.\n" +
      "Some expansion/contraction; typically light colors only."
  },

  { title: "Glazing", body: "The glass incorporated into a building or set within a window sash." },
  {
    title: "Single glazing",
    body:
      "One layer of glass.\n" +
      "Only acceptable in mild climates due to low resistance to heat flow.\n" +
      "Moisture may condense on interior surface in cold weather."
  },
  { title: "Double glazing", body: "Two layers of glass; or single glazing with storm windows is minimum acceptable under most building codes." },
  { title: "Triple glazing", body: "Two outer glass sheets with a thin, highly transparent plastic film stretched in the middle of the airspace." },

  { title: "Hopper Window", body: "Image / diagram reference." },

  {
    title: "Mild Window Seal Failure",
    body:
      "Intermittent fogging.\n" +
      "Corner moisture: small droplets/haze in corners of IGU.\n" +
      "Minor warping: slightly distorted/wavy glass as gas begins to escape.\n" +
      "Slight drafts.\n" +
      "Apparent dirtiness: trapped moisture/mineral deposits between panes."
  },
  { title: "Mild Seal Failure — CAUSING", body: "Diminished energy efficiency and curb appeal." },

  { title: "Apron", body: "Bottom trim piece beneath the window sill." },
  { title: "Eave", body: "The part of a roof that meets or overhangs the walls of a building." },

  { title: "Roof Anatomy (Pic)", body: "Image / diagram reference." },
  { title: "Rake", body: "Exposed portion on the sides of a gable roof from the eave to the ridge on the sloped sides." },
  { title: "Flashing", body: "Thin sheet material (metal/plastic/rubber/waterproof paper) used to prevent water passage through joints in wall/roof/chimney." },
  { title: "Gable", body: "The triangular part of a wall enclosed between the sloping portions of a roof." },
  { title: "Ridge", body: "Peak where two roof slopes align." },
  { title: "Drip Edge", body: "Flashing on roof edges to prevent water infiltration under membrane and direct rainwater into gutters." },
  { title: "Valley", body: "Where roof angles meet and collect ice and water." },

  {
    title: "Fascia",
    body:
      "Long straight board/panel along the roofline edge (the \"face\" of the roof).\n" +
      "Covers rafter/truss ends; provides a finished look.\n" +
      "Helps protect roof structure by preventing water infiltration at roof edges."
  },
  {
    title: "Soffit",
    body:
      "Horizontal finished underside of the roof overhang.\n" +
      "Connects roof edge to exterior wall.\n" +
      "Protects attic from moisture/pests and supports ventilation."
  },

  {
    title: "Severe Window Seal Failure",
    body:
      "Persistent condensation/fog between panes that won’t clear.\n" +
      "Silica haze: milky film/streaks from mineral deposits.\n" +
      "Visible sealant damage: peeling/cracking/shrinking.\n" +
      "Significantly warped glass (pressure imbalance).\n" +
      "Organic growth/rot; drafts and temperature fluctuations."
  },
  {
    title: "Severe Seal Failure — CAUSING",
    body:
      "Higher energy bills (HVAC works harder).\n" +
      "Water damage/rot to frame and surrounding materials.\n" +
      "Compromised indoor air quality (mold/mildew).\n" +
      "Extensive repairs: often requires IGU replacement."
  },

  { title: "Wood Rot", body: "Termites/bugs; drafts/leaks; inoperable; can’t open; not energy efficient; aesthetics." },
  { title: "Dry vs Wet Rot on wood windows", body: "Image / diagram reference." },
  { title: "Bowing", body: "Hard to operate; security risk; drafts; leaks." },

  { title: "Bow window", body: "4 or more windows as a single piece that are the same size, joined together to form a gentle, gradual curve." },
  { title: "Bay window", body: "Protrudes from exterior wall creating an interior alcove; typically 3 windows with the middle being the largest." },
  { title: "Pivot Window", body: "Rotates around a central pivot (horizontal or vertical); swings with part inside and part outside; common in modern/large windows." },

  { title: "Shingle damage", body: "Curling, cracking, or missing shingles → exposes underlayment and decking." },
  {
    title: "Granule loss",
    body:
      "Asphalt shingles shed protective granules into gutters.\n" +
      "Makes shingles age faster (UV damage, water intrusion).\n" +
      "Often worse on south- and west-facing slopes."
  },
  { title: "Roof Leaks & Water Stains", body: "Interior water spots/ceiling stains/damp insulation; may come from flashing failure, nail pops, or underlayment breakdown." },

  { title: "Roofing System Diagram", body: "Anatomy of the roof system from shingle to decking (diagram reference)." },
  { title: "Roofing System Diagram 2", body: "Anatomy of the roof system from shingle to decking (diagram reference)." },
  { title: "Roof Layers Simplified", body: "Diagram reference." },

  {
    title: "Box Gutters",
    body:
      "Often on older homes close together (Pittsburgh/Monroeville).\n" +
      "Can NOT set a home for roofing or siding with box gutters.\n" +
      "Box Gutters = do not set unless windows are involved."
  },

  { title: "Door Anatomy", body: "Diagram reference." },
  { title: "Siding Anatomy", body: "Diagram reference." },
  { title: "Siding/Gutter Anatomy", body: "Diagram reference." },

  { title: "Types of Siding", body: "Main: Vinyl, Cement, Wood, Aluminum, Cedar." },

  {
    title: "Board & Batten Siding",
    body:
      "Wide boards with narrow battens covering joints.\n" +
      "Traditional, rustic, timeless.\n" +
      "Boards run horizontally with small gaps; battens applied vertically over joints."
  },
  {
    title: "Backerboard/Sheathing",
    body:
      "Structural layer beneath siding panels (plywood, OSB, foam boards).\n" +
      "Adds rigidity and a flat surface for siding.\n" +
      "Helps prevent moisture infiltration and supports insulation/efficiency."
  },
  { title: "Siding Face", body: "The visible/exposed surface of the siding panel (texture/pattern/color/finish)." },

  { title: "T-Channel", body: "Trim to connect ends of two siding panels; common transition from horizontal wall siding to vertical gable siding; creates a seamless connection." },
  { title: "F-Channel", body: "Trim component designed to accommodate siding/soffit panels at a 90-degree angle to the fastening structure." },
  { title: "J-Channel", body: "Trim that creates a groove for panel ends; used around windows, doors, eaves, and soffits." },
  { title: "Siding Trim", body: "Assorted trim pieces that provide a polished finished edge; enhances the overall aesthetic quality of the siding system." },

  { title: "Exposed Fiber Glass on shingles", body: "Indicator of advanced shingle wear (fiberglass mat exposure)." }
];

export default slides;
