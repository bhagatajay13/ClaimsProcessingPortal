import { ArrowRight, CheckCircle, Clock3, FileWarning, WalletCards } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export default function Dashboard() {
  const navigate = useNavigate();
  const claims = useAppSelector(state => state.claims.claims);

  const pending = claims.filter(claim => claim.status === 'Pending').length;
  const inProgress = claims.filter(claim => claim.status === 'In Progress').length;
  const approved = claims.filter(claim => claim.status === 'Approved').length;
  const rejected = claims.filter(claim => claim.status === 'Rejected').length;

  const cards = [
    {
      label: 'Total claims',
      value: claims.length,
      icon: WalletCards,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock3,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'In progress',
      value: inProgress,
      icon: FileWarning,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Approved',
      value: approved,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Insurance claims overview and processing summary
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;

          return (
            <section
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Recent claims</h2>
              <p className="text-xs text-slate-500">Latest claim records</p>
            </div>
            <button
              className="flex items-center gap-1 text-sm text-violet-600"
              onClick={() => navigate('/claims')}
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {claims.slice(0, 5).map(claim => (
              <button
                key={claim.id}
                className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
                onClick={() => navigate(`/claims/${claim.id}`)}
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{claim.id}</p>
                  <p className="text-xs text-slate-500">{claim.claimantName}</p>
                </div>
                <span className="text-xs font-medium text-slate-600">{claim.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-800">Claim status</h2>
          <p className="mt-1 text-xs text-slate-500">Distribution by current state</p>

          <div className="mt-5 space-y-4">
            {[
              ['Pending', pending, 'bg-amber-500'],
              ['In Progress', inProgress, 'bg-blue-500'],
              ['Approved', approved, 'bg-emerald-500'],
              ['Rejected', rejected, 'bg-red-500'],
            ].map(([label, count, color]) => (
              <div key={String(label)}>
                <div className="mb-1 flex justify-between text-xs text-slate-600">
                  <span>{label}</span>
                  <span>{Number(count).toLocaleString()}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${color}`}
                    style={{
                      width: `${claims.length ? (Number(count) / claims.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
