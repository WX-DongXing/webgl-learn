import React, {useEffect, useState} from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import Triangle from './pages/Triangle';
import Point from './pages/Point';

const Routes = [
  { name: 'Triangle', exact: true, path: '/', component: Triangle },
  { name: 'Point', path: '/point', component: Point },
];

const titleMapping = new Map([
  ['/', 'WebGL Triangle'],
  ['/point', 'WebGL Point'],
])

function Header () {
  const { pathname } = useLocation();
  const [title, setTitle] = useState();
  useEffect(() => {
    setTitle(titleMapping.get(pathname))
  }, [pathname])

  return (
    <header style={{height: '45px'}}>
      <p>{title}</p>
    </header>
  )
}

export default function Router () {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ height: 'calc(100vh - 45px)', overflow: 'hidden' }}>
        <Switch>
          {
            Routes.map(route => (
              <Route key={route.name} {...route} />
            ))
          }
        </Switch>
      </main>
    </BrowserRouter>
  )
}
