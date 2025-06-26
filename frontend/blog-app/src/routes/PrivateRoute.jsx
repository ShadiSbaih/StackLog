import React from 'react'
import { Outlet } from 'react-router-dom'

function PrivateRoute({ allowedRoles }) {
  <Outlet />
}

export default PrivateRoute