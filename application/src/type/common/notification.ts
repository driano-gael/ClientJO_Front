export interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onCloseAction?: () => void;
}