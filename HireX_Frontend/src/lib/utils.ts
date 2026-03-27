import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import {toast} from 'react-toastify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function notify(message: string, type: "success" | "error" | "info" | "warning" = "info") {
  switch (type) {
    case "success": 
      toast.success(message); 
      break;
    case "error":
      toast.error(message);
      break;  
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
}   