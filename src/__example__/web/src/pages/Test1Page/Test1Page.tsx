import React from 'react'

import { Links } from '../../components/Links/Links.jsx'
import { getCount } from '../../counterState.js'
import { Layout } from '../Layout.js'

export default function Test1Page() {
  return (
    <Layout>
      <h1>Test 1</h1>
      counter state: {getCount()}
      <Links />
    </Layout>
  )
}
