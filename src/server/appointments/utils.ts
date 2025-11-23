export function getDurationForType(type: string) {
  switch (type) {
    case "CONSULTATION": return 30;
    case "URGENCY": return 15;
    case "FOLLOW_UP": return 20;
    case "CONTROL": return 10;
    default: return 30;
  }
}
