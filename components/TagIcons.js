import { Feather } from '@expo/vector-icons';

export const TAG_ICONS = {
  'Passport': <Feather name="globe" size={16} color="#FFDA32" />,
  'Ticket': <Feather name="film" size={16} color="#FFDA32" />,
  'Visa': <Feather name="credit-card" size={16} color="#FFDA32" />,
  'License': <Feather name="file-text" size={16} color="#FFDA32" />,
  'Insurance': <Feather name="shield" size={16} color="#FFDA32" />,
  'Lease': <Feather name="home" size={16} color="#FFDA32" />,
  'Certificate': <Feather name="book" size={16} color="#FFDA32" />,
  'Tax': <Feather name="dollar-sign" size={16} color="#FFDA32" />,
  'Contract': <Feather name="file-text" size={16} color="#FFDA32" />,
  'Medical': <Feather name="heart" size={16} color="#FFDA32" />,
  'Education': <Feather name="book-open" size={16} color="#FFDA32" />,
  'Financial': <Feather name="dollar-sign" size={16} color="#FFDA32" />,
  'Utility': <Feather name="zap" size={16} color="#FFDA32" />,
  'Work': <Feather name="briefcase" size={16} color="#FFDA32" />,
  'Other': <Feather name="file" size={16} color="#FFDA32" />

};

// TODO: For full theme support, refactor to a function that takes a color prop if you want icons to match theme accent.
// For now, icons remain blue for both modes.

export const TAGS = Object.keys(TAG_ICONS);