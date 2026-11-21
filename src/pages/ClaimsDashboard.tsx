import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
  type RowClickedEvent,
} from 'ag-grid-community';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  deleteClaim,
  assignClaim,
  selectClaim,
  updateClaim,
} from '../features/claims/ClaimsSlice';
import type { Claim } from '../types/claims';
import { hasPermission } from '../features/auth/permissions';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ClaimsDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const claims = useAppSelector(state => state.claims.claims);
  const role = useAppSelector(state => state.auth.role);

  const [message, setMessage] = useState('');
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);

  const handleEdit = (claim: Claim) => {
    setEditingClaim({ ...claim });
  };

  const saveEditedClaim = () => {
    if (!editingClaim) return;

    dispatch(updateClaim(editingClaim));
    setMessage(`${editingClaim.id} updated successfully`);
    setEditingClaim(null);
  };

  const handleDelete = (claim: Claim) => {
    if (window.confirm(`Delete claim ${claim.id}?`)) {
      dispatch(deleteClaim(claim.id));
      setMessage(`${claim.id} deleted`);
    }
  };

  const handleAssign = (claim: Claim) => {
    const assignee = window.prompt(
      'Assign to:',
      'Claims Team'
    );

    if (assignee?.trim()) {
      dispatch(assignClaim({
        id: claim.id,
        assignedTo: assignee.trim(),
      }));
      setMessage(`${claim.id} assigned successfully`);
    }
  };

  const columnDefs = useMemo<ColDef<Claim>[]>(() => [
    {
      field: 'id',
      headerName: 'Claim ID',
      minWidth: 140,
    },
    {
      field: 'claimantName',
      headerName: 'Claimant Name',
      minWidth: 170,
    },
    {
      field: 'policyNumber',
      headerName: 'Policy Number',
      minWidth: 145,
    },
    {
      field: 'claimType',
      headerName: 'Claim Type',
      minWidth: 130,
    },
    {
      field: 'claimAmount',
      headerName: 'Claim Amount',
      minWidth: 140,
      valueFormatter: params =>
        params.value == null
          ? ''
          : `₹${params.value.toLocaleString('en-IN')}`,
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      cellStyle: params => ({
        color:
          params.value === 'Approved'
            ? '#059669'
            : params.value === 'Rejected'
              ? '#DC2626'
              : '#D97706',
        fontWeight: '600',
      }),
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      minWidth: 150,
    },
    {
      field: 'documentSize',
      headerName: 'Document Size',
      minWidth: 130,
      cellRenderer: (params: ICellRendererParams<Claim>) => {
        const claim = params.data;
        if (!claim) return null;

        return (
          <button
            className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
            title="Open document workspace"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(selectClaim(claim));
              navigate(
                `/claims/${claim.id}/document/claim-report-${claim.id}`
              );
            }}
          >
            {claim.documentSize} PDF
          </button>
        );
      },
    },
    {
      headerName: 'Actions',
      minWidth: 210,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<Claim>) => {
        const claim = params.data;

        if (!claim) return null;

        return (
          <div className="flex items-center gap-3 h-full">
            {hasPermission(role, 'EDIT_CLAIM') && (
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={(event) => {
                  event.stopPropagation();
                  handleEdit(claim);
                }}
              >
                Edit
              </button>
            )}

            {hasPermission(role, 'ASSIGN_CLAIM') && (
              <button
                className="text-green-600 hover:text-green-800"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAssign(claim);
                }}
              >
                Assign
              </button>
            )}

            {hasPermission(role, 'DELETE_CLAIM') && (
              <button
                className="text-red-600 hover:text-red-800"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDelete(claim);
                }}
              >
                Delete
              </button>
            )}
          </div>
        );
      },
    },
  ], [dispatch, navigate, role]);

  const defaultColDef = useMemo<ColDef<Claim>>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }), []);

  const handleRowClick = (event: RowClickedEvent<Claim>) => {
    if (!event.data) return;
    if (event.column?.getColId() === 'documentSize') return;

    if (
      event.event &&
      event.event.target instanceof HTMLElement &&
      event.event.target.closest('button')
    ) return;

    dispatch(selectClaim(event.data));
    navigate(`/claims/${event.data.id}`);
  };

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            All Claims
          </h2>
          <p className="text-sm text-emerald-500 mt-1">
            {claims.length.toLocaleString()} insurance claims
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm">
          {message}
          <button
            className="ml-3 underline"
            onClick={() => setMessage('')}
          >
            Dismiss
          </button>
        </div>
      )}

      {editingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit claim</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update claim details. Document size is read-only.
                </p>
              </div>
              <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {editingClaim.id}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600">
                Claimant name
                <input
                  value={editingClaim.claimantName}
                  onChange={event => setEditingClaim({ ...editingClaim, claimantName: event.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Policy number
                <input
                  value={editingClaim.policyNumber}
                  onChange={event => setEditingClaim({ ...editingClaim, policyNumber: event.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Claim type
                <input
                  value={editingClaim.claimType}
                  onChange={event => setEditingClaim({ ...editingClaim, claimType: event.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Claim amount
                <input
                  type="number"
                  min={0}
                  value={editingClaim.claimAmount}
                  onChange={event => setEditingClaim({
                    ...editingClaim,
                    claimAmount: Number(event.target.value) || 0,
                  })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Location
                <input
                  value={editingClaim.location}
                  onChange={event => setEditingClaim({ ...editingClaim, location: event.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Status
                <select
                  value={editingClaim.status}
                  onChange={event => setEditingClaim({
                    ...editingClaim,
                    status: event.target.value as Claim['status'],
                  })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <label className="text-sm text-slate-600">
                Assigned to
                <input
                  value={editingClaim.assignedTo}
                  onChange={event => setEditingClaim({ ...editingClaim, assignedTo: event.target.value })}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="text-sm text-slate-600">
                Document size
                <input
                  value={editingClaim.documentSize}
                  readOnly
                  className="mt-1 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700"
                onClick={() => setEditingClaim(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                onClick={saveEditedClaim}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div style={{ height: 600, width: '100%' }}>
          <AgGridReact<Claim>
            theme={themeQuartz}
            rowData={claims}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={50}
            paginationPageSizeSelector={[25, 50, 100]}
            animateRows={false}
            rowHeight={48}
            onRowClicked={handleRowClick}
          />
        </div>
      </div>

    </div>
  );
}
