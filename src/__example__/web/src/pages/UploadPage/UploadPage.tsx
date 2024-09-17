import React from 'react'

import { Links } from '../../components/Links/Links.js'

export default function UploadPage() {
  return (
    <div>
      <h1>Testing an upload</h1>
      <Links />

      <form action="/upload" method="post" encType="multipart/form-data">
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}
