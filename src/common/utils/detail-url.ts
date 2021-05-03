import qs from 'query-string'
import type { RouteComponentProps } from 'react-router-dom'

const ROUTE_NAME = 'detail'

export interface DetailUrlProps {
  id: string
}

export function parseURL(location: RouteComponentProps['location']) {
  if(location.pathname !== '/' + ROUTE_NAME) {
    return null
  }
  return qs.parse(location.search) as unknown as DetailUrlProps
}

export function generateURL(props: DetailUrlProps) {
  return '/' + ROUTE_NAME + '?' + qs.stringify(props)
}