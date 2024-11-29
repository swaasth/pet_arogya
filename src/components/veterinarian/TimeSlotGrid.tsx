import React from 'react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

interface TimeSlotGridProps {
  slots: Array<{
    startTime: string
    endTime: string
    available: boolean
  }>
  onSlotToggle: (index: number) => void
  isLoading?: boolean
}

export default function TimeSlotGrid({
  slots,
  onSlotToggle,
  isLoading
}: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot, index) => (
        <Button
          key={slot.startTime}
          variant="outline"
          className={cn(
            'h-auto py-2',
            slot.available && 'bg-green-100 hover:bg-green-200'
          )}
          onClick={() => onSlotToggle(index)}
          disabled={isLoading}
        >
          <div className="text-xs">
            {slot.startTime}
            <br />
            {slot.endTime}
          </div>
        </Button>
      ))}
    </div>
  )
} 