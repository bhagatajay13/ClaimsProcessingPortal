import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

export default function ClaimDetails() {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const selectedClaim = useAppSelector(state => state.claims.selectedClaim);
  const claim = useAppSelector(state =>
    state.claims.claims.find(item => item.id === claimId)
  ) ?? selectedClaim;

  if (!claim) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Claim not found</h2>
        <button
          className="mt-4 inline-flex items-center gap-2 text-blue-600"
          onClick={() => navigate('/claims')}
        >
          <ArrowLeft size={16} /> Back to claims
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
        onClick={() => navigate('/claims')}
      >
        <ArrowLeft size={16} /> Back to claims
      </button>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm text-slate-500">Claim ID</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{claim.id}</h1>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {claim.status}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Claimant</dt>
            <dd className="mt-1 font-medium text-slate-800">{claim.claimantName}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Policy number</dt>
            <dd className="mt-1 font-medium text-slate-800">{claim.policyNumber}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Claim type</dt>
            <dd className="mt-1 font-medium text-slate-800">{claim.claimType}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Claim amount</dt>
            <dd className="mt-1 font-medium text-slate-800">
              ₹{claim.claimAmount.toLocaleString('en-IN')}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Location</dt>
            <dd className="mt-1 font-medium text-slate-800">{claim.location}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Assigned to</dt>
            <dd className="mt-1 font-medium text-slate-800">{claim.assignedTo}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-200 p-4">
          <FileText className="text-blue-600" size={22} />
          <div>
            <p className="text-sm font-medium text-slate-800">Claim documents</p>
            <p className="text-xs text-slate-500">{claim.documentSize} total document size</p>
          </div>
        </div>
      </section>
    </div>
  );
}
