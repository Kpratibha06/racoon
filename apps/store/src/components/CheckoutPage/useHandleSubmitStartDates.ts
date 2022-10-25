import { datadogLogs } from '@datadog/browser-logs'
import { FormEventHandler } from 'react'
import { useStartDateUpdateMutation } from '@/services/apollo/generated'
import { formatAPIDate } from './CheckoutPage.helpers'
import { CheckoutPageProps } from './CheckoutPage.types'

type Params = {
  cartId: string
  products: CheckoutPageProps['products']
  onSuccess: () => void
}

export const useHandleSubmitStartDates = ({ cartId, products, onSuccess }: Params) => {
  const [updateStartDate, result] = useStartDateUpdateMutation()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    datadogLogs.logger.info('Checkout | Submit user start dates')

    const updates = products.map((product) => {
      const inputElement = event.currentTarget.elements.namedItem(product.offerId)

      if (!isDateInputElement(inputElement)) {
        datadogLogs.logger.warn('Unable to update start dates', {
          input: inputElement,
          elements: event.currentTarget.elements,
        })
        throw new Error(`No date input for ${product.offerId}`)
      }

      const startDate = inputElement.valueAsDate ? formatAPIDate(inputElement.valueAsDate) : null

      return {
        offerId: product.offerId,
        startDate,
      }
    })

    const result = await updateStartDate({ variables: { input: { cartId, updates } } })

    const data = result.data
    if (data && data.cartEntriesStartDateUpdate.userErrors.length === 0) {
      onSuccess()
    }
  }

  return [handleSubmit, result] as const
}

const isDateInputElement = (value: unknown): value is HTMLInputElement => {
  return typeof value === 'object' && value !== null && 'valueAsDate' in value
}
