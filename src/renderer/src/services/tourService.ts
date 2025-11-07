/**
 * Copyright (c) 2025 Johuniq(https://johuniq.tech). All rights reserved.
 * Licensed under Proprietary License - See LICENSE file
 * Unauthorized use, copying, or distribution is strictly prohibited.
 */

import type { AllowedButtons, Config, DriveStep, Driver, State } from 'driver.js'
import { driver } from 'driver.js'

export interface TourStep extends Omit<DriveStep, 'element' | 'popover'> {
  element?: string
  title?: string
  description?: string
  popover?: DriveStep['popover']
}

export interface TourOptions {
  config: Config
  state: State
  driver: Driver
}

export interface TourConfig {
  name: string
  steps: TourStep[]
  allowClose?: boolean
  animate?: boolean
  opacity?: number
  padding?: number
  showProgress?: boolean
  progressText?: string
  showButtons?: AllowedButtons[]
  nextBtnText?: string
  prevBtnText?: string
  doneBtnText?: string
  onDestroyed?: () => void
  onHighlighted?: (element: Element | undefined, step: DriveStep, options: TourOptions) => void
  onDeselected?: (element: Element | undefined, step: DriveStep, options: TourOptions) => void
}

class TourService {
  private driverInstance: Driver | null = null
  private currentTour: string | null = null

  private getDefaultConfig(): object {
    return {
      allowClose: true,
      animate: true,
      overlayOpacity: 0.75,
      padding: 10,
      showProgress: true,
      progressText: 'Step {{current}} of {{total}}',
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Done',
      className: 'pharmacy-tour'
    }
  }

  public startTour(config: TourConfig): void {
    // Destroy existing instance if any
    this.destroyTour()

    const resolvedSteps = config.steps.map(({ element, title, description, popover, ...rest }) => {
      const finalPopover: NonNullable<DriveStep['popover']> = {
        ...(popover ?? {})
      }

      if (title) {
        finalPopover.title = title
      }

      if (description) {
        finalPopover.description = description
      }

      const stepConfig: DriveStep = {
        ...rest,
        ...(element ? { element } : {}),
        ...(Object.keys(finalPopover).length > 0 ? { popover: finalPopover } : {})
      }

      return stepConfig
    })

    // Create new driver instance
    this.driverInstance = driver({
      ...this.getDefaultConfig(),
      ...config,
      steps: resolvedSteps,
      onDestroyed: () => {
        this.currentTour = null
        this.driverInstance = null
        config.onDestroyed?.()
      },
      onHighlighted: (element, step, options) => {
        // Add custom styling to highlighted elements
        if (element) {
          element.setAttribute('data-tour-active', 'true')
        }
        config.onHighlighted?.(element, step, options)
      },
      onDeselected: (element, step, options) => {
        // Remove custom styling from deselected elements
        if (element) {
          element.removeAttribute('data-tour-active')
        }
        config.onDeselected?.(element, step, options)
      }
    })

    this.currentTour = config.name
    this.driverInstance.drive()
  }

  public destroyTour(): void {
    if (this.driverInstance) {
      this.driverInstance.destroy()
      this.driverInstance = null
      this.currentTour = null

      // Clean up any tour attributes
      document.querySelectorAll('[data-tour-active]').forEach((el) => {
        el.removeAttribute('data-tour-active')
      })
    }
  }

  public hasActiveTour(): boolean {
    return this.driverInstance !== null
  }

  public getCurrentTour(): string | null {
    return this.currentTour
  }

  public moveNext(): void {
    this.driverInstance?.moveNext()
  }

  public movePrevious(): void {
    this.driverInstance?.movePrevious()
  }

  public isFirstStep(): boolean {
    return this.driverInstance?.isFirstStep() || false
  }

  public isLastStep(): boolean {
    return this.driverInstance?.isLastStep() || false
  }

  public getActiveIndex(): number {
    return this.driverInstance?.getActiveIndex() || 0
  }

  public getTotalSteps(): number {
    const steps = this.driverInstance?.getConfig()?.steps || []
    return Array.isArray(steps) ? steps.length : 0
  }

  public highlight(element: string): void {
    this.driverInstance?.highlight({
      element,
      popover: {
        title: 'Highlighted Element',
        description: 'This element has been highlighted for your attention.'
      }
    })
  }
}

// Export singleton instance
export const tourService = new TourService()
export default tourService
