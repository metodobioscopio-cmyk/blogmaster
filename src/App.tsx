import { useEffect, useState } from 'react';
import { Sidebar, type RouteId, ROUTES } from './components/Sidebar';
import { ToastRoot } from './components/ui';
import { PLAN_LIMITS, useActiveCampaign, useStore } from './state/store';
import Dashboard from './pages/Dashboard';
import Demand from './pages/Demand';
import Audit from './pages/Audit';
import Angle from './pages/Angle';
import TrackingPage from './pages/Tracking';
import Decide from './pages/Decide';
import Scale from './pages/Scale';
import Test72 from './pages/Test72';
import Plan14 from './pages/Plan14';
import Benchmarks from './pages/Benchmarks';
import Stack from './pages/Stack';
import ExportPage from './pages/Export';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';

function useHashRoute(): [RouteId, (r: RouteId) => void] {
  const read = (): RouteId => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    return (ROUTES.find((r) => r.id === raw)?.id ?? 'dashboard') as RouteId;
  };
  const [route, setRoute] = useState<RouteId>(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return [route, (r) => (window.location.hash = `#/${r}`)];
}

export default function App() {
  const [route, go] = useHashRoute();
  const { state } = useStore();
  const campaign = useActiveCampaign();
  const limits = PLAN_LIMITS[state.plan];
  const meta = ROUTES.find((r) => r.id === route)!;

  const body = (() => {
    switch (route) {
      case 'dashboard': return <Dashboard go={go} />;
      case 'demand': return <Demand />;
      case 'audit': return <Audit />;
      case 'angle': return <Angle />;
      case 'tracking': return <TrackingPage />;
      case 'decide': return <Decide />;
      case 'scale': return <Scale />;
      case 'test72': return <Test72 />;
      case 'plan14': return <Plan14 />;
      case 'benchmarks': return <Benchmarks />;
      case 'stack': return <Stack />;
      case 'export': return <ExportPage />;
      case 'pricing': return <Pricing />;
      case 'settings': return <Settings />;
      default: return <Dashboard go={go} />;
    }
  })();

  return (
    <div className="shell">
      <Sidebar route={route} go={go} />
      <div className="shell__main">
        <header className="topbar">
          <div>
            <div className="topbar__title">{meta.title}</div>
            <div className="topbar__sub">{meta.sub}</div>
          </div>
          <div className="spacer" />
          <div className="row" style={{ gap: 8 }}>
            <span className="badge">{limits.label}</span>
            <span className="badge badge--ghost mono">{state.workspace.currency}</span>
            <span className="badge badge--ghost" title={campaign?.name}>
              {campaign ? truncate(campaign.name, 26) : 'sem campanha'}
            </span>
          </div>
        </header>
        <main className="page">{body}</main>
      </div>
      <ToastRoot />
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
