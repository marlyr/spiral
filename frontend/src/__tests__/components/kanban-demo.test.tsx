import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { KanbanDemo } from '@/components/kanban-demo'

describe('KanbanDemo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // jsdom returns zero rects; mock a realistic size so the animation runs
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 480, height: 210,
      top: 0, left: 0, bottom: 210, right: 480,
      x: 0, y: 0,
      toJSON: () => ({}),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders three column headers', () => {
    render(<KanbanDemo />)
    expect(screen.getByText('Not Started')).toBeInTheDocument()
    expect(screen.getByText('Working On')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('shows the animated skill card on initial render', () => {
    render(<KanbanDemo />)
    expect(screen.getByText('Forward crossovers')).toBeInTheDocument()
  })

  it('completes a full animation cycle and card is still present', async () => {
    render(<KanbanDemo />)
    await act(async () => { vi.advanceTimersByTime(6000) })
    // After a full cycle the board resets; card should still be in the DOM
    expect(screen.getByText('Forward crossovers')).toBeInTheDocument()
  })

  it('shows static skills throughout the cycle', async () => {
    render(<KanbanDemo />)
    await act(async () => { vi.advanceTimersByTime(6000) })
    expect(screen.getByText('Two-foot glide')).toBeInTheDocument()
    expect(screen.getByText('Forward swizzles')).toBeInTheDocument()
    expect(screen.getByText('Waltz jump')).toBeInTheDocument()
  })
})
