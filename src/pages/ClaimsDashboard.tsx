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

  const handleEdit = (claim: Claim) => {
    const name = window.prompt(
      'Enter claimant name',
      claim.claimantName
    );

    if (name?.trim()) {
      dispatch({
        type: 'claims/updateClaim',
        payload: { ...claim, claimantName: name.trim() },
      });
      setMessage(`${claim.id} updated successfully`);
    }
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
    if (
      event.event instanceof HTMLElement &&
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
