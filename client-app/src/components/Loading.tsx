import { LoaderIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="animate-spin" />
      <span className="ml-2">Memuat halaman...</span>
    </div>
  )
}