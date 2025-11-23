"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ label, date, setDate }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor="date">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size={"sm"}
            variant="outline"
            id="date"
            className="justify-between font-normal shadow-none"
          >
            {date ? date : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate("billingDate", date?.toLocaleDateString())
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
