'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

export const CalendarPicker = ({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (date: Date) => void }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))

    const days = []
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth())
    const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth())

    // Prev month padding
    const prevMonthDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1)
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, current: false })
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, current: true })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, current: false })
    }

    return (
        <div className="calendar-popover" onClick={e => e.stopPropagation()}>
            <div className="calendar-header-picker">
                <button type="button" className="nav-arrow" onClick={prevMonth}>
                    <ChevronLeft size={16} />
                </button>
                <span className="calendar-month">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                <button type="button" className="nav-arrow" onClick={nextMonth}>
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="calendar-grid">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="day-name">{d}</div>
                ))}
                {days.map((d, i) => {
                    const isSelected = d.current &&
                        d.day === selectedDate.getDate() &&
                        viewDate.getMonth() === selectedDate.getMonth() &&
                        viewDate.getFullYear() === selectedDate.getFullYear()

                    return (
                        <div
                            key={i}
                            className={cn(
                                "calendar-day",
                                !d.current && "muted",
                                isSelected && "active"
                            )}
                            onClick={() => d.current && onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), d.day))}
                        >
                            {d.day}
                        </div>
                    )
                })}
            </div>
            <style jsx>{`
                .calendar-popover {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 8px;
                    background: #18181b;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1rem;
                    z-index: 1000;
                    width: 280px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                }
                .calendar-header-picker {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .calendar-month {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: white;
                }
                .nav-arrow {
                    padding: 4px;
                    border-radius: 6px;
                    color: #71717a;
                    transition: all 0.2s;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                }
                .nav-arrow:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }
                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                }
                .day-name {
                    font-size: 0.75rem;
                    color: #52525b;
                    text-align: center;
                    padding-bottom: 8px;
                    font-weight: 600;
                }
                .calendar-day {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    color: #a1a1aa;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .calendar-day:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .calendar-day.muted {
                    color: #3f3f46;
                    cursor: default;
                }
                .calendar-day.active {
                    background: #6366f1;
                    color: white;
                    font-weight: 600;
                }
            `}</style>
        </div>
    )
}
