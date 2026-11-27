// Scroll offsets for the skrollr scenes. These mirror the frame positions
// declared by the data-* attributes in the original static pages.
export const NL_SCENES = [
  2001, 2901, 5201, 6101, 7801, 8901, 10101, 10801, 11101,
  11701, 12201, 12701, 13201, 13701, 14201, 15103, 15601,
  16401, 17201, 17801, 18401, 19001, 19401, 20401, 20900,
  21701, 22602, 23101, 26200,
];

export const PL_SCENES = [
  3201, 3701, 3801, 4100, 4600, 5100, 5600, 6100, 6600, 7100,
  7901, 8201, 9500, 11200, 12100, 13000, 14601, 15401,
  15901, 16501, 17101, 17701, 18301, 18901, 19501, 20101,
  20902, 21601, 22201, 22801, 23301, 23901, 24501, 25201,
  25601, 26501, 27401, 28801, 29502, 30101, 31400,
];

export const EXPERIENCE = {
  newLawyer: {
    scenes: NL_SCENES,
    initial: 601,
    videoRange: [23100, 24199],
    clientType: 'New Lawyer',
  },
  practicingLawyer: {
    scenes: PL_SCENES,
    initial: 1200,
    videoRange: [30100, 31199],
    clientType: 'Practicing Lawyer',
  },
};
