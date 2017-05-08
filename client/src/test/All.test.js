import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { MemoryRouter as Router, Route } from 'react-router-dom'

import { 
  Home,
  Collection,
  Collections,
  Results,
  NotFound,
  Create,
  Account,
  User,
} from './pages/'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Router><Home /></Router>, div)
})


it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Router><Create /></Router>, div)
})
