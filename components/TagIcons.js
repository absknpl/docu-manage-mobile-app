import { Feather } from '@expo/vector-icons';

export const TAG_ICONS = {
  'Passport': <Feather name="globe" size={16} color="#6366f1" />,
  'Visa': <Feather name="credit-card" size={16} color="#6366f1" />,
  'License': <Feather name="file-text" size={16} color="#6366f1" />,
  'Insurance': <Feather name="shield" size={16} color="#6366f1" />,
  'Lease': <Feather name="home" size={16} color="#6366f1" />,
  'Certificate': <Feather name="book" size={16} color="#6366f1" />,
  'Tax': <Feather name="dollar-sign" size={16} color="#6366f1" />,
  'Contract': <Feather name="file-text" size={16} color="#6366f1" />,
  'Medical': <Feather name="heart" size={16} color="#6366f1" />,
  'Education': <Feather name="book-open" size={16} color="#6366f1" />,
  'Financial': <Feather name="dollar-sign" size={16} color="#6366f1" />,
  'Utility': <Feather name="zap" size={16} color="#6366f1" />,
  'Other': <Feather name="file" size={16} color="#6366f1" />,
  'Work': <Feather name="briefcase" size={16} color="#6366f1" />
};

// TODO: For full theme support, refactor to a function that takes a color prop if you want icons to match theme accent.
// For now, icons remain blue for both modes.

export const TAGS = Object.keys(TAG_ICONS);