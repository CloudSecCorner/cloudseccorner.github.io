import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        secondary:
          "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
        destructive:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        outline: 
          "border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300",
        // Custom variants for tags with GitHub-like styling
       
        // Security-related variants
        appSecurity: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        webSecurity: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        networkSecurity: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        cloudSecurity: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
        containerSecurity: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
        pentest: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
        vulnScan: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        intrusion: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        sysAudit: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
        threatIntel: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        secDistro: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        wirelessSec: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
        password: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        recon: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
        plain: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 